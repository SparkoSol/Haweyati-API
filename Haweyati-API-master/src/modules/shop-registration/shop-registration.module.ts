import { Module } from '@nestjs/common';
import { ShopRegistrationController } from './shop-registration.controller';
import { ShopRegistrationService } from './shop-registration.service';
import {MongooseModule} from "@nestjs/mongoose";
import {ShopRegistrationSchema} from "../../data/schemas/shopRegistration.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'cityregistration', schema:ShopRegistrationSchema}])],
  controllers: [ShopRegistrationController],
  providers: [ShopRegistrationService],
  exports: [ShopRegistrationService]
})
export class ShopRegistrationModule {}
