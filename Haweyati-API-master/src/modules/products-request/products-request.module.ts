import { Module } from '@nestjs/common';
import { ProductsRequestService } from './products-request.service';
import { ProductsRequestController } from './products-request.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {ProductsRequestSchema} from "../../data/schemas/productsRequest.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'productsrequest', schema:ProductsRequestSchema}])],
  providers: [ProductsRequestService],
  controllers: [ProductsRequestController],
  exports: [ProductsRequestController]
})
export class ProductsRequestModule {}
