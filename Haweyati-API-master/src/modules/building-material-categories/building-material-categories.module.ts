import { Module } from '@nestjs/common';
import { BuildingMaterialCategoriesService } from './building-material-categories.service';
import { BuildingMaterialCategoriesController } from './building-material-categories.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {BuildingMaterialCategoriesSchema} from "../../data/schemas/buildingMaterialCategories.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'buildingmaterialcategories', schema: BuildingMaterialCategoriesSchema}])],
  providers: [BuildingMaterialCategoriesService],
  controllers: [BuildingMaterialCategoriesController],
  exports: [BuildingMaterialCategoriesService]
})
export class BuildingMaterialCategoriesModule {}
