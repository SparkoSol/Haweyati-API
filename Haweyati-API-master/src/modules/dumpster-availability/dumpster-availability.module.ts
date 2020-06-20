import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DumpsterAvailabilitySchema } from '../../data/schemas/dumpsterAvailability';
import { DumpsterAvailabilityController } from './dumpster-availability.controller';
import { DumpsterAvailabilityService } from './dumpster-availability.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'dumpsterAvailability',
        schema: DumpsterAvailabilitySchema
      }
    ]),
  ],
  controllers: [DumpsterAvailabilityController],
  providers: [DumpsterAvailabilityService],
  exports: [DumpsterAvailabilityService]
})
export class DumpsterAvailabilityModule {}

