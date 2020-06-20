import { Module } from '@nestjs/common';
import { DriverCustomerChatMessagesService } from './driver-customer-chat-messages.service';
import { DriverCustomerChatMessagesController } from './driver-customer-chat-messages.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {DriverCustomerChatMessagesSchema} from "../../data/schemas/driverCustomerChatMessages.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'drivercustomerchatmessages', schema: DriverCustomerChatMessagesSchema}])],
  providers: [DriverCustomerChatMessagesService],
  controllers: [DriverCustomerChatMessagesController],
  exports: [DriverCustomerChatMessagesService]
})
export class DriverCustomerChatMessagesModule {}
