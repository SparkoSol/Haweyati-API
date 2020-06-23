import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { SimpleController } from '../../common/lib/simple.controller';
import { IBuildingMaterialCategory } from '../../data/interfaces/buildingMaterialCategory.interface';
import { BuildingMaterialCategoryService } from './building-material-category.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('building-material-category')
export class BuildingMaterialCategoryController extends SimpleController<IBuildingMaterialCategory>{
  constructor(protected readonly service: BuildingMaterialCategoryService) {
    super(service);
  }
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  postOverride(@UploadedFiles() files, @Body() buildingMaterialCategory: any){
    buildingMaterialCategory.images = files
    return this.service.create(buildingMaterialCategory);
  }
}
