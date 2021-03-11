import {
  Body,
  Controller, HttpException, HttpStatus, Post, UploadedFile, UseInterceptors
} from '@nestjs/common'
import { ImageController } from '../../common/lib/image.controller'
import { BuildingMaterialCategoryService } from './building-material-category.service'
import { IBuildingMaterialCategory } from '../../data/interfaces/buildingMaterialCategory.interface'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('building-material-category')
export class BuildingMaterialCategoryController extends ImageController<
  IBuildingMaterialCategory
> {
  constructor(protected readonly service: BuildingMaterialCategoryService) {
    super(service)
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  postOverride(@UploadedFile() file, @Body() buildingMaterialCategory: any): Promise<IBuildingMaterialCategory> {
    if (!file)
      throw new HttpException(
        'Image is Required!',
        HttpStatus.NOT_ACCEPTABLE
      );
    return super.post(file, buildingMaterialCategory)
  }
}
