import { Module } from '@nestjs/common';
import { RejectedDriversService } from './rejected-drivers.service';
import { RejectedDriversController } from './rejected-drivers.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {RejectedDriversSchema} from "../../data/schemas/rejectedDrivers.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'rejecteddrivers', schema: RejectedDriversSchema}])],
  providers: [RejectedDriversService],
  controllers: [RejectedDriversController],
  exports: [RejectedDriversService]
})
export class RejectedDriversModule {}
