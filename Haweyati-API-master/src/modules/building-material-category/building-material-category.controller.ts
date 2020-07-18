import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SimpleController } from '../../common/lib/simple.controller';
import { IBuildingMaterialCategory } from '../../data/interfaces/buildingMaterialCategory.interface';
import { BuildingMaterialCategoryService } from './building-material-category.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('building-material-category')
export class BuildingMaterialCategoryController extends SimpleController<IBuildingMaterialCategory>{
  constructor(protected readonly service: BuildingMaterialCategoryService) {
    super(service);
  }
  @Post()
  @UseInterceptors(FileInterceptor('images'))
  postOverride(@UploadedFile() file, @Body() buildingMaterialCategory: any){
    buildingMaterialCategory.images = [file].map(file1 => ({
      name: file1.filename,
      path: file1.path
    }))
    return this.service.create(buildingMaterialCategory);
  }
}
