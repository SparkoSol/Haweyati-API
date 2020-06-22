import { Module } from '@nestjs/common';
import { FinishingMaterialsService } from './finishing-materials.service';
import { FinishingMaterialsController } from './finishing-materials.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {FinishingMaterialsSchema} from "../../data/schemas/finishingMaterials.schema";
import { MulterModule } from '@nestjs/platform-express';
import { ShopRegistrationModule } from '../shop-registration/shop-registration.module';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'finishingmaterials', schema: FinishingMaterialsSchema}]),
    MulterModule.register({
      dest: '../uploads',
    }),
    ShopRegistrationModule
  ],
  providers: [FinishingMaterialsService],
  controllers: [FinishingMaterialsController],
  exports: [FinishingMaterialsService]
})
export class FinishingMaterialsModule {}
