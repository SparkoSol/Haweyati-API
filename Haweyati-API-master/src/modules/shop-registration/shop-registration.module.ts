import { Module } from '@nestjs/common';
import { ShopRegistrationController } from './shop-registration.controller';
import { ShopRegistrationService } from './shop-registration.service';
import {MongooseModule} from "@nestjs/mongoose";
import {ShopRegistrationSchema} from "../../data/schemas/shopRegistration.schema";
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([{name:'shopregistration', schema:ShopRegistrationSchema}]),
    MulterModule.register({
      dest : '../uploads'
    })
  ],
  controllers: [ShopRegistrationController],
  providers: [ShopRegistrationService],
  exports: [ShopRegistrationService]
})
export class ShopRegistrationModule {}
