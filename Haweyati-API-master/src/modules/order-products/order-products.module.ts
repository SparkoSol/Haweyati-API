import { Module } from '@nestjs/common';
import { OrderProductsService } from './order-products.service';
import { OrderProductsController } from './order-products.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {OrderProductsSchema} from "../../data/schemas/orderProducts.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'orderproducts', schema: OrderProductsSchema}])],
  providers: [OrderProductsService],
  controllers: [OrderProductsController],
  exports: [OrderProductsService]
})
export class OrderProductsModule {}
