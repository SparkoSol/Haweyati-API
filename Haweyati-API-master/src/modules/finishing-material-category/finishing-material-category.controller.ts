import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SimpleController } from '../../common/lib/simple.controller';
import { IFinishingMaterialCategory } from '../../data/interfaces/finishingMaterialCategory.interface';
import { FinishingMaterialCategoryService } from './finishing-material-category.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('finishing-material-category')
export class FinishingMaterialCategoryController extends SimpleController<IFinishingMaterialCategory>{
  constructor(protected readonly service: FinishingMaterialCategoryService) {
    super(service);
  }
  @Post()
  @UseInterceptors(FileInterceptor('images'))
  postOverride(@UploadedFile() file, @Body() finishingMaterialCategory: any){
    finishingMaterialCategory.images = file
    return this.service.create(finishingMaterialCategory);
  }
}