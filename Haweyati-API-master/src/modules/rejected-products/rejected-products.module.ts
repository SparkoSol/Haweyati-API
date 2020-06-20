import { Module } from '@nestjs/common';
import { RejectedProductsService } from './rejected-products.service';
import { RejectedProductsController } from './rejected-products.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {RejectedProductsSchema} from "../../data/schemas/rejectedProducts.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'rejectedproducts', schema: RejectedProductsSchema}])],
  providers: [RejectedProductsService],
  controllers: [RejectedProductsController],
  exports: [RejectedProductsService]
})
export class RejectedProductsModule {}
