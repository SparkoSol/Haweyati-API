import { Module } from '@nestjs/common';
import { FinishingMaterialCategoriesService } from './finishing-material-categories.service';
import { FinishingMaterialCategoriesController } from './finishing-material-categories.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {FinishingMaterialCategoriesSchema} from "../../data/schemas/finishingMaterialCategories.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'finishingmaterialcategories', schema:FinishingMaterialCategoriesSchema}])],
  providers: [FinishingMaterialCategoriesService],
  controllers: [FinishingMaterialCategoriesController],
  exports: [FinishingMaterialCategoriesService]
})
export class FinishingMaterialCategoriesModule {}
