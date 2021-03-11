import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SimpleService } from '../../common/lib/simple.service'
import { ITimeSlots } from '../../data/interfaces/timeSlots.interface'

@Injectable()
export class TimeSlotsService extends SimpleService<ITimeSlots> {
  constructor(
    @InjectModel('timeslots')
    protected readonly model: Model<ITimeSlots>
  )
  {
    super(model)
  }

  async updateTimeSlots(document: any): Promise<ITimeSlots[]> {
    for (const item of document) {
      await super.change(item)
    }
    return (await this.fetch()) as ITimeSlots[]
  }
}
