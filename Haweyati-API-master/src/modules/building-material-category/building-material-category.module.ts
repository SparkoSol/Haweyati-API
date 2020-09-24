import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { BuildingMaterialCategoryService } from './building-material-category.service';
import { BuildingMaterialCategoryController } from './building-material-category.controller';
import { BuildingMaterialCategorySchema } from '../../data/schemas/buildingMaterialCategory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name:'buildingmaterialcategory', schema: BuildingMaterialCategorySchema}]),
    MulterModule.register({
      dest: '../uploads',
    })
  ],
  providers: [BuildingMaterialCategoryService],
  controllers: [BuildingMaterialCategoryController],
  exports: [BuildingMaterialCategoryService]
})
export class BuildingMaterialCategoryModule {}
