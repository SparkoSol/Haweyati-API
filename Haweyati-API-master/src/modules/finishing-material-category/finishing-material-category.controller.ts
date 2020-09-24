import { Controller } from '@nestjs/common'
import { ImageController } from '../../common/lib/image.controller'
import { FinishingMaterialCategoryService } from './finishing-material-category.service'
import { IFinishingMaterialCategory } from '../../data/interfaces/finishingMaterialCategory.interface'

@Controller('finishing-material-category')
export class FinishingMaterialCategoryController extends ImageController<
  IFinishingMaterialCategory
> {
  constructor(protected readonly service: FinishingMaterialCategoryService) {
    super(service)
  }
}
