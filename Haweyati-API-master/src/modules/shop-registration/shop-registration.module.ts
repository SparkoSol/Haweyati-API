import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import { MulterModule } from '@nestjs/platform-express';
import { PersonsModule } from "../persons/persons.module";
import { ShopRegistrationService } from './shop-registration.service';
import { ShopRegistrationController } from './shop-registration.controller';
import { ImageConversionUtils } from '../../common/lib/image-conversion-utils'
import {ShopRegistrationSchema} from "../../data/schemas/shop-registration.schema";
import { AdminNotificationsModule } from '../admin-notifications/admin-notifications.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      {name:'shopregistration', schema:ShopRegistrationSchema}
    ]),
    PersonsModule,
    MulterModule.register({
      dest : ImageConversionUtils.imagePath
    }),
    AdminNotificationsModule
  ],
  controllers: [ShopRegistrationController],
  providers: [ShopRegistrationService],
  exports: [ShopRegistrationService]
})
export class ShopRegistrationModule {}
