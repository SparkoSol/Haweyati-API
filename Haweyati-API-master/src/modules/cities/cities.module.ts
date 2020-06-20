import { Module } from '@nestjs/common';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import {MongooseModule} from "@nestjs/mongoose";
import { CitiesSchema } from "../../data/schemas/cities.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'cities', schema:CitiesSchema}])],
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [CitiesService]
})
export class CitiesModule {}
