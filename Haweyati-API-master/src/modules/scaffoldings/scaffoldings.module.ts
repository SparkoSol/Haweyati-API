import { Module } from '@nestjs/common';
import { ScaffoldingsService } from './scaffoldings.service';
import { ScaffoldingsController } from './scaffoldings.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {ScaffoldingsSchema} from "../../data/schemas/scaffoldings.schema";
import { MulterModule } from '@nestjs/platform-express';
import { ShopRegistrationModule } from '../shop-registration/shop-registration.module';

@Module({
  imports: [
     MongooseModule.forFeature([{name:'scaffoldings', schema: ScaffoldingsSchema}]),
    MulterModule.register({
      dest: '../uploads',
    }),
    ShopRegistrationModule
  ],
  providers: [ScaffoldingsService],
  controllers: [ScaffoldingsController],
  exports: [ScaffoldingsService]
})
export class ScaffoldingsModule {}
