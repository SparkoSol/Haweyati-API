import { Module } from '@nestjs/common';
import { BuildingMaterialCategoryService } from './building-material-category.service';
import { BuildingMaterialCategoryController } from './building-material-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildingMaterialsSchema } from '../../data/schemas/buildingMaterials.schema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([{name:'buildingmaterialcategory', schema: BuildingMaterialsSchema}]),
    MulterModule.register({
      dest: '../uploads',
    })
  ],
  providers: [BuildingMaterialCategoryService],
  controllers: [BuildingMaterialCategoryController],
  exports: [BuildingMaterialCategoryService]
})
export class BuildingMaterialCategoryModule {}
