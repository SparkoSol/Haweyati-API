import { Module } from '@nestjs/common';
import { BuildingMaterialCategoryService } from './building-material-category.service';
import { BuildingMaterialCategoryController } from './building-material-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildingMaterialCategorySchema } from '../../data/schemas/buildingMaterialCategory.schema';
import { MulterModule } from '@nestjs/platform-express';

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
