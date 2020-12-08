import { Body, Controller, HttpException, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { ImageController } from '../../common/lib/image.controller'
import { FinishingMaterialCategoryService } from './finishing-material-category.service'
import { IFinishingMaterialCategory } from '../../data/interfaces/finishingMaterialCategory.interface'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('finishing-material-category')
export class FinishingMaterialCategoryController extends ImageController<
  IFinishingMaterialCategory
> {
  constructor(protected readonly service: FinishingMaterialCategoryService) {
    super(service)
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  postOverride(@UploadedFile() file, @Body() data: any) {
    if (!file)
      throw new HttpException(
        'Image is Required!',
        HttpStatus.NOT_ACCEPTABLE
      );
    return super.post(file, data)
  }
}
