import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import {MongooseModule} from "@nestjs/mongoose";
import {ProductsSchema} from "../../data/schemas/products.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'products', schema:ProductsSchema}])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
