import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {OrdersSchema} from "../../data/schemas/orders.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'orders', schema: OrdersSchema}])],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService]
})
export class OrdersModule {}
