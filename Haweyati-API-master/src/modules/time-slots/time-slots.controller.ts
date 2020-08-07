import {
  Body,
  Controller,
  Patch,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { SimpleController } from '../../common/lib/simple.controller'
import { ITimeSlots } from '../../data/interfaces/timeSlots.interface'
import { TimeSlotsService } from './time-slots.service'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('time-slots')
export class TimeSlotsController extends SimpleController<ITimeSlots> {
  constructor(protected readonly service: TimeSlotsService) {
    super(service)
  }

  @Patch()
  async update(@Body() data: any): Promise<ITimeSlots[]> {
    return await this.service.update1(data)
  }
}
