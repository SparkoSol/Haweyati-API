import { Module } from '@nestjs/common';
import { DriverSupplierChatsService } from './driver-supplier-chats.service';
import { DriverSupplierChatsController } from './driver-supplier-chats.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {DriverSupplierChatsSchema} from "../../data/schemas/driverSupplierChats.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'driversupplierchats', schema: DriverSupplierChatsSchema}])],
  providers: [DriverSupplierChatsService],
  controllers: [DriverSupplierChatsController],
  exports: [DriverSupplierChatsService]
})
export class DriverSupplierChatsModule {}
