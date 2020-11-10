import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { MulterModule } from '@nestjs/platform-express';
import { ScaffoldingsService } from './scaffoldings.service';
import { ScaffoldingsController } from './scaffoldings.controller';
import { ScaffoldingsSchema } from "../../data/schemas/scaffoldings.schema";
import { ImageConversionUtils } from '../../common/lib/image-conversion-utils'
import { ShopRegistrationModule } from '../shop-registration/shop-registration.module';

@Module({
  imports: [
     MongooseModule.forFeature([{name:'scaffoldings', schema: ScaffoldingsSchema}]),
    MulterModule.register({
      dest: ImageConversionUtils.imagePath
    }),
    ShopRegistrationModule
  ],
  providers: [ScaffoldingsService],
  controllers: [ScaffoldingsController],
  exports: [ScaffoldingsService]
})
export class ScaffoldingsModule {}
