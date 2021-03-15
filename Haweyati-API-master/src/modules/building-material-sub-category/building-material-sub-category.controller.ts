import {
  Get,
  Post,
  Body,
  Param,
  Controller,
  HttpStatus,
  UploadedFile,
  HttpException,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImageController } from '../../common/lib/image.controller'
import { BuildingMaterialSubCategoryService } from './building-material-sub-category.service'
import { IBuildingMaterialSubCategory } from '../../data/interfaces/buildingMaterialSubCategory.interface'

@Controller('building-material-sub-category')
export class BuildingMaterialSubCategoryController extends ImageController<
  IBuildingMaterialSubCategory
> {
  constructor(protected readonly service: BuildingMaterialSubCategoryService) {
    super(service)
  }

  @Get('getbyparent/:id')
  getByParentId(
    @Param('id') id: string
  ): Promise<IBuildingMaterialSubCategory[]> {
    return this.service.fetchByParentId(id)
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  postOverride(
    @UploadedFile() file,
    @Body() data: IBuildingMaterialSubCategory
  ): Promise<IBuildingMaterialSubCategory> {
    if (!file)
      throw new HttpException('Image is Required!', HttpStatus.NOT_ACCEPTABLE)
    return super.post(file, data)
  }
}
