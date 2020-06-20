import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {CustomersSchema} from "../../data/schemas/customers.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'customers', schema: CustomersSchema}])],
  providers: [CustomersService],
  controllers: [CustomersController],
  exports: [CustomersController]
})
export class CustomersModule {}
