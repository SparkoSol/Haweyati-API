import { CitySchema } from "../../data/schemas/city.schema";
import { CityController } from './city.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { CityService } from './city.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [MongooseModule.forFeature([{name: 'city', schema: CitySchema}])],
  providers: [CityService],
  controllers: [CityController]
})
export class CityModule {}
