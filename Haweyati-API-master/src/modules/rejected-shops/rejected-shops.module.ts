import { Module } from '@nestjs/common';
import { RejectedShopsService } from './rejected-shops.service';
import { RejectedShopsController } from './rejected-shops.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {RejectedShopsSchema} from "../../data/schemas/rejectedShops.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'rejectedshops', schema: RejectedShopsSchema}])],
  providers: [RejectedShopsService],
  controllers: [RejectedShopsController],
  exports: [RejectedShopsService]
})
export class RejectedShopsModule {}
