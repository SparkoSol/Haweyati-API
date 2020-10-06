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
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImageController } from '../../common/lib/image.controller'
import { FinishingMaterialsService } from './finishing-materials.service'
import { IFinishingMaterialsInterface } from '../../data/interfaces/finishingMaterials.interface'
import { query } from 'express'

@Controller('finishing-materials')
export class FinishingMaterialsController extends ImageController<
  IFinishingMaterialsInterface
> {
  constructor(
    protected readonly service: FinishingMaterialsService
  )
  {
    super(service)
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query() data: any): Promise<IFinishingMaterialsInterface[] | IFinishingMaterialsInterface> {
    if (data.name)
      return this.service.fetchAndSearch(id , data)
    else
      return this.service.fetch(id)
  }

  protected parseData(finishingMaterial: any) {
    if (finishingMaterial.price == '0') {
      let option = []
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
        }else {
          if (Array.isArray(data)) {
            for (let j = 0; j < data.length; j++)
              priceObj[finishingMaterial.optionName] = data[j]
          } else {
            priceObj[finishingMaterial.optionName] = data
          }
        }

        priceObj['price'] = finishingMaterial.varientPrice
        pricing.push(priceObj)
      }

      finishingMaterial.varient = pricing
    } else {
      finishingMaterial.varient = []
      finishingMaterial.options = []
    }
    return finishingMaterial
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  post(@UploadedFile() file, @Body() finishingMaterial: any) {
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
  ): Promise<IFinishingMaterialsInterface[] | IFinishingMaterialsInterface> {
    return this.service.fetchByParentId(id)
  }

  @Get('available')
  async Get(@Query() data): Promise<any> {
    return await this.service.getByCity(data.city, data.parent)
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

  @Get('search')
  async search(@Query() query: any): Promise<IFinishingMaterialsInterface[]>{
    return await this.service.search(query.name)
  }
}
