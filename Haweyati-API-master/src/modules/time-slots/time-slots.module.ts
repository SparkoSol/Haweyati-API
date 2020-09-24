import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TimeSlotsService } from './time-slots.service'
import { TimeSlotsController } from './time-slots.controller'
import { TimeSlotsSchema } from '../../data/schemas/timeSlots.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'timeslots', schema: TimeSlotsSchema }])
  ],
  providers: [TimeSlotsService],
  controllers: [TimeSlotsController]
})
export class TimeSlotsModule {}
