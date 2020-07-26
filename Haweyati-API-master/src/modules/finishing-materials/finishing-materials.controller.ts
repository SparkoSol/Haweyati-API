import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { IFinishingMaterialsInterface } from '../../data/interfaces/finishingMaterials.interface'
import { FinishingMaterialsService } from './finishing-materials.service'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { ImageController } from '../../common/lib/image.controller'

@Controller('finishing-materials')
export class FinishingMaterialsController extends ImageController<
  IFinishingMaterialsInterface
> {
  constructor(protected readonly service: FinishingMaterialsService) {
    super(service)
  }

  private parseData(finishingMaterial: any) {
    if (finishingMaterial.price == '0') {
      let option = []
      if (Array.isArray(finishingMaterial.optionName)) {
        for (let i = 0; i < finishingMaterial.optionName.length; i++) {
          option[i] = {
            optionName: finishingMaterial.optionName[i],
            optionValues: finishingMaterial.optionValues[i]
          }
        }
        finishingMaterial.options = option
      } else {
        option[0] = {
          optionName: finishingMaterial.optionName,
          optionValues: finishingMaterial.optionValues
        }
        finishingMaterial.options = option
      }

      const pricing = []
      if (Array.isArray(finishingMaterial.varientName)) {
        for (let i = 0; i < finishingMaterial.varientName.length; ++i) {
          const data = finishingMaterial.varientName[i].split('/')

          const pricingObj = {}
          for (let j = 0; j < data.length; ++j)
            pricingObj[finishingMaterial.optionName[j]] = data[j]

          pricingObj['price'] = finishingMaterial.varientPrice[i]
          pricing.push(pricingObj)
        }
      } else {
        const priceObj = {}
        const data = finishingMaterial.varientName.includes('/')
          ? finishingMaterial.varientName.split('/')
          : finishingMaterial.varientName
        if (Array.isArray(data)) {
          for (let i = 0; i < data.length; i++)
            priceObj[finishingMaterial.optionName[i]] = data[i]
          priceObj['price'] = finishingMaterial.varientPrice
          pricing.push(priceObj)
        } else {
          priceObj[finishingMaterial.optionName] = data
          priceObj['price'] = finishingMaterial.varientPrice
          pricing.push(priceObj)
        }
      }

      finishingMaterial.varient = pricing
    }
    return finishingMaterial
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  post(@UploadedFile() file, @Body() finishingMaterial: any) {
    finishingMaterial = this.parseData(finishingMaterial)
    return super.post(file, finishingMaterial)
  }

  @Patch()
  @UseInterceptors(FileInterceptor('image'))
  patch(@UploadedFile() file, @Body() finishingMaterial: any) {
    // console.log(finishingMaterial)
    finishingMaterial = this.parseData(finishingMaterial)
    return super.patch(file, finishingMaterial)
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
}
