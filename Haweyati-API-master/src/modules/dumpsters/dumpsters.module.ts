import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DumpstersSchema } from '../../data/schemas/dumpsters.schema';
import { DumpstersController } from './dumpsters.controller';
import { DumpstersService } from './dumpsters.service';
import { MulterModule } from '@nestjs/platform-express';
import { ShopRegistrationModule } from '../shop-registration/shop-registration.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'dumpsters',
        schema: DumpstersSchema
      }
    ]),
    MulterModule.register({
      dest: '../uploads',
    }),
    ShopRegistrationModule
  ],
  controllers: [DumpstersController],
  providers: [DumpstersService],
  exports: [DumpstersService]
})
export class DumpstersModule {}

