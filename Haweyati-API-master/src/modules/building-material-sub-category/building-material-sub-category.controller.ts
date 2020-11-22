import { Controller, Get, Param } from '@nestjs/common'
import { ImageController } from '../../common/lib/image.controller'
import { IBuildingMaterialSubCategory } from '../../data/interfaces/buildingMaterialSubCategory.interface'
import { BuildingMaterialSubCategoryService } from './building-material-sub-category.service'

@Controller('building-material-sub-category')
export class BuildingMaterialSubCategoryController extends ImageController<IBuildingMaterialSubCategory>{
  constructor(protected readonly service: BuildingMaterialSubCategoryService) {
    super(service);
  }

  @Get('getbyparent/:id')
  getByParentId(
    @Param('id') id: string
  ): Promise<IBuildingMaterialSubCategory[]> {
    return this.service.fetchByParentId(id)
  }
}
