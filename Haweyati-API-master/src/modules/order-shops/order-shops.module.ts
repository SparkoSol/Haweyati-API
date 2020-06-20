import { Module } from '@nestjs/common';
import { OrderShopsService } from './order-shops.service';
import { OrderShopsController } from './order-shops.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {OrderDriversSchema} from "../../data/schemas/orderDrivers.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'ordershops', schema: OrderDriversSchema}])],
  providers: [OrderShopsService],
  controllers: [OrderShopsController],
  exports: [OrderShopsService]
})
export class OrderShopsModule {}
