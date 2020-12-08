import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { ImageController } from '../../common/lib/image.controller'
import { IBuildingMaterialSubCategory } from '../../data/interfaces/buildingMaterialSubCategory.interface'
import { BuildingMaterialSubCategoryService } from './building-material-sub-category.service'
import { FileInterceptor } from '@nestjs/platform-express'

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
