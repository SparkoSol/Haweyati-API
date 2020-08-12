import { HttpModule, Module } from '@nestjs/common';
import { ShopRegistrationController } from './shop-registration.controller';
import { ShopRegistrationService } from './shop-registration.service';
import {MongooseModule} from "@nestjs/mongoose";
import {ShopRegistrationSchema} from "../../data/schemas/shop-registration.schema";
import { MulterModule } from '@nestjs/platform-express';
import { PersonsModule } from "../persons/persons.module";
import { AdminNotificationsModule } from '../admin-notifications/admin-notifications.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      {name:'shopregistration', schema:ShopRegistrationSchema}
    ]),
    PersonsModule,
    MulterModule.register({
      dest : '../uploads'
    }),
    HttpModule,
    AdminNotificationsModule
  ],
  controllers: [ShopRegistrationController],
  providers: [ShopRegistrationService],
  exports: [ShopRegistrationService]
})
export class ShopRegistrationModule {}
