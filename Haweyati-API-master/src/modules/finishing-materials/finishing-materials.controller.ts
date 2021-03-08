import {
  Get,
  Body,
  Post,
  Param,
  Patch,
  Query,
  Delete,
  Controller,
  UploadedFile,
  UseInterceptors, HttpException, HttpStatus
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImageController } from '../../common/lib/image.controller'
import { FinishingMaterialsService } from './finishing-materials.service'
import { IFinishingMaterials } from '../../data/interfaces/finishingMaterials.interface'
import { IFinishingMaterialCategory } from "../../data/interfaces/finishingMaterialCategory.interface";

@Controller('finishing-materials')
export class FinishingMaterialsController extends ImageController<IFinishingMaterials> {
  constructor(protected readonly service: FinishingMaterialsService) {
    super(service)
  }

  @Get('available')
  async Get(@Query() data): Promise<any> {
    return await this.service.getByCity(data.city, data.parent)
  }

  @Get('available-supplier')
  async getByParentSupplier(@Query() data): Promise<any> {
    return await this.service.getByParentSupplier(data.parent, data.supplier)
  }

  //-----------------------------------------------------------------//
  @Get('categories-supplier/:id')
  async getCategoriesFromSupplier(@Param('id') id: string): Promise<IFinishingMaterialCategory[]>{
    return await this.service.getCategoriesFromSupplier(id)
  }

  @Get('search')
  async search(@Query() data): Promise<IFinishingMaterials[]>{
    return await this.service.search(data.name, data.parent, data.supplier)
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query() data: any): Promise<IFinishingMaterials[] | IFinishingMaterials> {
    if (data.name)
      return this.service.fetchAndSearch(id , data)
    else
      return this.service.fetch(id)
  }

  protected parseData(finishingMaterial: any) {
    if (finishingMaterial.price == '0') {
      const option = []
      if (Array.isArray(finishingMaterial.optionName)) {
        for (let i = 0; i < finishingMaterial.optionName.length; i++) {
          option[i] = {
            optionName: finishingMaterial.optionName[i],
            optionValues: finishingMaterial.optionValues[i]
          }
        }
      }
      else {
        option[0] = {
          optionName: finishingMaterial.optionName,
          optionValues: finishingMaterial.optionValues
        }
      }
      finishingMaterial.options = option

      const pricing = []
      if (Array.isArray(finishingMaterial.varientName)) {
        for (let i = 0; i < finishingMaterial.varientName.length; ++i) {
          const data = finishingMaterial.varientName[i].includes('/')
            ? finishingMaterial.varientName[i].split('/')
            : finishingMaterial.varientName[i]

          const pricingObj = {}
          if (Array.isArray(finishingMaterial.optionName)){
            if (Array.isArray(data)){
              for (let j = 0; j < data.length; ++j)
                pricingObj[finishingMaterial.optionName[j]] = data[j]
            }
            else
              pricingObj[finishingMaterial.optionName] = data
          }
          else {
            if (Array.isArray(data)){
              for (let j = 0; j < data.length; ++j)
                pricingObj[finishingMaterial.optionName] = data[j]
            }
            else
              pricingObj[finishingMaterial.optionName] = data
          }

          pricingObj['price'] = finishingMaterial.varientPrice[i]
          pricingObj['volumetricWeight'] = finishingMaterial.varientWeight[i]
          pricingObj['cbmLength'] = finishingMaterial.varientLength[i]
          pricingObj['cbmWidth'] = finishingMaterial.varientWidth[i]
          pricingObj['cbmHeight'] = finishingMaterial.varientHeight[i]
          pricing.push(pricingObj)
        }
      }
      else {
        const priceObj = {}
        const data = finishingMaterial.varientName.includes('/')
          ? finishingMaterial.varientName.split('/')
          : finishingMaterial.varientName

        if (Array.isArray(finishingMaterial.optionName)){
          if (Array.isArray(data)) {
            for (let j = 0; j < data.length; j++)
              priceObj[finishingMaterial.optionName[j]] = data[j]
          } else {
            priceObj[finishingMaterial.optionName] = data
          }
        }
        else {
          if (Array.isArray(data)) {
            for (let j = 0; j < data.length; j++)
              priceObj[finishingMaterial.optionName] = data[j]
          } else {
            priceObj[finishingMaterial.optionName] = data
          }
        }

        priceObj['price'] = finishingMaterial.varientPrice
        priceObj['volumetricWeight'] = finishingMaterial.varientWeight
        priceObj['cbmLength'] = finishingMaterial.varientLength
        priceObj['cbmWidth'] = finishingMaterial.varientWidth
        priceObj['cbmHeight'] = finishingMaterial.varientHeight
        pricing.push(priceObj)
      }

      finishingMaterial.varient = pricing
    }
    else {
      finishingMaterial.varient = []
      finishingMaterial.options = []
    }
    if (finishingMaterial.price == 0){
      finishingMaterial.volume = undefined
      finishingMaterial.webassembly = undefined
    }
    return finishingMaterial
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  post(@UploadedFile() file, @Body() finishingMaterial: any) {
    if (!file)
      throw new HttpException(
        'Image is Required!',
        HttpStatus.NOT_ACCEPTABLE
      );
    return super.post(file, this.parseData(finishingMaterial))
  }

  @Patch()
  @UseInterceptors(FileInterceptor('image'))
  patch(@UploadedFile() file, @Body() finishingMaterial: any) {
    return super.patch(file, this.parseData(finishingMaterial))
  }

  @Get('getbyparent/:id')
  getByParentId(
    @Param('id') id: string
  ): Promise<IFinishingMaterials[] | IFinishingMaterials> {
    return this.service.fetchByParentId(id)
  }

  //Admin Panel
  @Get('fromsupplier/:id')
  async fromSupplier(@Param('id') id: string): Promise<any> {
    return await this.service.getSuppliers(id)
  }

  //Deleting Building Material Category here because circular dependencies are not allowed
  @Delete('deletecategory/:id')
  async deleteCategory(@Param('id') id: string): Promise<any> {
    return await this.service.deleteCategory(id)
  }
}
