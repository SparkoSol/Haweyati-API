import {
  Controller
} from '@nestjs/common'
import { IBuildingMaterialCategory } from '../../data/interfaces/buildingMaterialCategory.interface'
import { BuildingMaterialCategoryService } from './building-material-category.service'
import { ImageController } from '../../common/lib/image.controller'

@Controller('building-material-category')
export class BuildingMaterialCategoryController extends ImageController<
  IBuildingMaterialCategory
> {
  constructor(protected readonly service: BuildingMaterialCategoryService) {
    super(service)
  }
}
