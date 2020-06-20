import { Module } from '@nestjs/common';
import { DriverCustomerChatsService } from './driver-customer-chats.service';
import { DriverCustomerChatsController } from './driver-customer-chats.controller';
import {MongooseModule} from "@nestjs/mongoose";

@Module({
  imports: [MongooseModule.forFeature([{name:'drivercustomerchats', schema: DriverCustomerChatsService}])],
  providers: [DriverCustomerChatsService],
  controllers: [DriverCustomerChatsController],
  exports: [DriverCustomerChatsService]
})
export class DriverCustomerChatsModule {}
