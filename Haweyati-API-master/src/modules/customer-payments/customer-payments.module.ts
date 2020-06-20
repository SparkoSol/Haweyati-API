import { Module } from '@nestjs/common';
import { CustomerPaymentsService } from './customer-payments.service';
import { CustomerPaymentsController } from './customer-payments.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {CustomerPaymentsSchema} from "../../data/schemas/customerPayments.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'customerpayments', schema:CustomerPaymentsSchema}])],
  providers: [CustomerPaymentsService],
  controllers: [CustomerPaymentsController],
  exports: [CustomerPaymentsService]
})
export class CustomerPaymentsModule {}
