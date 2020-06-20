import { Module } from '@nestjs/common';
import { FinishingMaterialsService } from './finishing-materials.service';
import { FinishingMaterialsController } from './finishing-materials.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {FinishingMaterialsSchema} from "../../data/interfaces/finishingMaterials.schema";

@Module({
  imports:[MongooseModule.forFeature([{name:'finishingmaterials', schema: FinishingMaterialsSchema}])],
  providers: [FinishingMaterialsService],
  controllers: [FinishingMaterialsController],
  exports: [FinishingMaterialsService]
})
export class FinishingMaterialsModule {}
