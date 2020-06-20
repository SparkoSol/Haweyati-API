import { Module } from '@nestjs/common';
import { OrderDriversService } from './order-drivers.service';
import { OrderDriversController } from './order-drivers.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {OrderDriversSchema} from "../../data/schemas/orderDrivers.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'orderdrivers', schema: OrderDriversSchema}])],
  providers: [OrderDriversService],
  controllers: [OrderDriversController],
  exports: [OrderDriversService]
})
export class OrderDriversModule {}
