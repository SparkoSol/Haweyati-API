import { Module } from '@nestjs/common';
import { DriverSupplierChatMessagesService } from './driver-supplier-chat-messages.service';
import { DriverSupplierChatMessagesController } from './driver-supplier-chat-messages.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {DriverSupplierChatMessagesSchema} from "../../data/schemas/driverSupplierChatMessages.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'driversupplierchatmessages', schema: DriverSupplierChatMessagesSchema}])],
  providers: [DriverSupplierChatMessagesService],
  controllers: [DriverSupplierChatMessagesController],
  exports: [DriverSupplierChatMessagesService]
})
export class DriverSupplierChatMessagesModule {}
