import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
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

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  postOverride(
    @UploadedFile() file,
    @Body() data: IFinishingMaterialCategory
  ): Promise<IFinishingMaterialCategory> {
    if (!file)
      throw new HttpException('Image is Required!', HttpStatus.NOT_ACCEPTABLE)
    return super.post(file, data)
  }
}
