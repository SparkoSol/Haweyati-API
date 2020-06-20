import { Module } from '@nestjs/common';
import { BuildingMaterialsController } from './building-materials.controller';
import { BuildingMaterialsService } from './building-materials.service';
import {MongooseModule} from "@nestjs/mongoose";
import {BuildingMaterialsSchema} from "../../data/schemas/buildingMaterials.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'buildingmaterials', schema: BuildingMaterialsSchema}])],
  controllers: [BuildingMaterialsController],
  providers: [BuildingMaterialsService],
  exports: [BuildingMaterialsService]
})
export class BuildingMaterialsModule {}
