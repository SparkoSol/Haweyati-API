import { Controller } from '@nestjs/common'
import { IFinishingMaterialCategory } from '../../data/interfaces/finishingMaterialCategory.interface'
import { FinishingMaterialCategoryService } from './finishing-material-category.service'
import { ImageController } from '../../common/lib/image.controller'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('finishing-material-category')
export class FinishingMaterialCategoryController extends ImageController<
  IFinishingMaterialCategory
> {
  constructor(protected readonly service: FinishingMaterialCategoryService) {
    super(service)
  }
}
