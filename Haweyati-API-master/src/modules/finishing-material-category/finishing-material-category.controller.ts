import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { SimpleController } from '../../common/lib/simple.controller';
import { IFinishingMaterialCategory } from '../../data/interfaces/finishingMaterialCategory.interface';
import { FinishingMaterialCategoryService } from './finishing-material-category.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('finishing-material-category')
export class FinishingMaterialCategoryController extends SimpleController<IFinishingMaterialCategory>{
  constructor(protected readonly service: FinishingMaterialCategoryService) {
    super(service);
  }
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  postOverride(@UploadedFiles() files, @Body() finishingMaterialCategory: any){
    finishingMaterialCategory.images = files
    return this.service.create(finishingMaterialCategory);
  }
}