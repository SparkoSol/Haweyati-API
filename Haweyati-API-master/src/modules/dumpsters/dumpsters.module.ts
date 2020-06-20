
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DumpstersSchema } from '../../data/schemas/dumpsters.schema';
import { DumpstersController } from './dumpsters.controller';
import { DumpstersService } from './dumpsters.service';
import { MulterModule } from '@nestjs/platform-express';

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
  ],
  controllers: [DumpstersController],
  providers: [DumpstersService],
  exports: [DumpstersService]
})
export class DumpstersModule {}

