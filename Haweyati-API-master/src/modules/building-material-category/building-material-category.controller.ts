import {
  Controller
} from '@nestjs/common'
import { ImageController } from '../../common/lib/image.controller'
import { BuildingMaterialCategoryService } from './building-material-category.service'
import { IBuildingMaterialCategory } from '../../data/interfaces/buildingMaterialCategory.interface'

@Controller('building-material-category')
export class BuildingMaterialCategoryController extends ImageController<
  IBuildingMaterialCategory
> {
  constructor(protected readonly service: BuildingMaterialCategoryService) {
    super(service)
  }
}
