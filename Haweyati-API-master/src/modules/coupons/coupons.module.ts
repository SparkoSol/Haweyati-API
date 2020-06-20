import { Module } from '@nestjs/common';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import {MongooseModule} from "@nestjs/mongoose";
import {CouponsSchema} from "../../data/schemas/coupons.schema";

@Module({
  imports: [MongooseModule.forFeature([{name:'coupons', schema:CouponsSchema}])],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService]
})
export class CouponsModule {}
