import { Module } from '@nestjs/common';
import { ScaffoldingsService } from './scaffoldings.service';
import { ScaffoldingsController } from './scaffoldings.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {ScaffoldingsSchema} from "../../data/schemas/scaffoldings.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'scaffoldings', schema: ScaffoldingsSchema}])],
  providers: [ScaffoldingsService],
  controllers: [ScaffoldingsController],
  exports: [ScaffoldingsService]
})
export class ScaffoldingsModule {}
