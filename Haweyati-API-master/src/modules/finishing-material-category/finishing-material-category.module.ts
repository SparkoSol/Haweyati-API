import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ImageConversionUtils } from '../../common/lib/image-conversion-utils'
import { FinishingMaterialCategoryService } from './finishing-material-category.service';
import { FinishingMaterialCategoryController } from './finishing-material-category.controller';
import { FinishingMaterialCategorySchema } from '../../data/schemas/finishingMaterialCategory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name:'finishingmaterialcategory', schema: FinishingMaterialCategorySchema}]),
    MulterModule.register({
      dest: ImageConversionUtils.imagePath
    })
  ],
  providers: [FinishingMaterialCategoryService],
  controllers: [FinishingMaterialCategoryController],
  exports: [FinishingMaterialCategoryService]
})
export class FinishingMaterialCategoryModule {}