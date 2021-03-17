import { TimeSlotsService } from './time-slots.service'
import { Body, Controller, Patch } from '@nestjs/common'
import { SimpleController } from '../../common/lib/simple.controller'
import { ITimeSlots } from '../../data/interfaces/timeSlots.interface'

@Controller('time-slots')
export class TimeSlotsController extends SimpleController<ITimeSlots> {
  constructor(protected readonly service: TimeSlotsService) {
    super(service)
  }

  @Patch()
  async update(@Body() data: any): Promise<ITimeSlots[]> {
    return await this.service.updateTimeSlots(data)
  }
}
