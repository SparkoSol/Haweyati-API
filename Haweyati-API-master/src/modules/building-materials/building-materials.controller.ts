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
import { BuildingMaterialsService } from './building-materials.service'
import { IBuildingMaterials } from '../../data/interfaces/buildingMaterials.interface'

@Controller('building-materials')
export class BuildingMaterialsController extends ImageController<IBuildingMaterials> {
  constructor(
    protected readonly service: BuildingMaterialsService
  )
  {
    super(service)
  }

  protected parseData(buildingMaterial: any) {
    if (Array.isArray(buildingMaterial.city)) {
      const list = []
      for (let i = 0; i < buildingMaterial.city.length; ++i) {
        list.push({
          city: buildingMaterial.city[i],
          price12yard: buildingMaterial.price12yard[i],
          price20yard: buildingMaterial.price20yard[i]
        })
      }
      buildingMaterial.pricing = list
    } else {
      buildingMaterial.pricing = [
        {
          city: buildingMaterial.city,
          price12yard: buildingMaterial.price12yard,
          price20yard: buildingMaterial.price20yard
        }
      ]
    }
    return buildingMaterial
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  post(@UploadedFile() file, @Body() buildingMaterial: any) {
    return super.post(file, this.parseData(buildingMaterial))
  }

  @Patch()
  @UseInterceptors(FileInterceptor('image'))
  patch(
    @UploadedFile() file,
    buildingMaterial: any
  ): Promise<IBuildingMaterials> {
    return super.patch(file, this.parseData(buildingMaterial))
  }

  @Get('getbyparent/:id')
  getByParentId(
    @Param('id') id: string
  ): Promise<IBuildingMaterials[] | IBuildingMaterials> {
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
  @Delete('delete-category/:id')
  async deleteCategory(@Param('id') id: string): Promise<any> {
    return await this.service.deleteCategory(id)
  }

  @Delete('delete-sub-category/:id')
  async deleteSubCategory(@Param('id') id: string): Promise<any> {
    return await this.service.deleteSubCategory(id)
  }
}
