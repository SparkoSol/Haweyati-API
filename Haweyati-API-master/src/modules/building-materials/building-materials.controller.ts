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
  UseInterceptors
} from '@nestjs/common'
import { IBuildingMaterialsInterface } from '../../data/interfaces/buildingMaterials.interface'
import { BuildingMaterialsService } from './building-materials.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImageController } from '../../common/lib/image.controller'

@Controller('building-materials')
export class BuildingMaterialsController extends ImageController<
  IBuildingMaterialsInterface
> {
  constructor(protected readonly service: BuildingMaterialsService) {
    super(service)
  }
  private parseData(buildingMaterial: any) {
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
    console.log(buildingMaterial)
    buildingMaterial = this.parseData(buildingMaterial)
    return super.post(file, buildingMaterial)
  }

  @Patch()
  @UseInterceptors(FileInterceptor('image'))
  patch(
    @UploadedFile() file,
    buildingMaterial: any
  ): Promise<IBuildingMaterialsInterface> {
    console.log(buildingMaterial)
    console.log(file)
    buildingMaterial = this.parseData(buildingMaterial)
    console.log(buildingMaterial)
    return super.patch(file, buildingMaterial)
  }

  @Get('getbyparent/:id')
  getByParentId(
    @Param('id') id: string
  ): Promise<IBuildingMaterialsInterface[] | IBuildingMaterialsInterface> {
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
