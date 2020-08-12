import { Injectable } from '@nestjs/common'
import { SimpleService } from '../../common/lib/simple.service'
import { ITimeSlots } from '../../data/interfaces/timeSlots.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class TimeSlotsService extends SimpleService<ITimeSlots> {
  constructor(
    @InjectModel('timeslots')
    protected readonly model: Model<ITimeSlots>
  )
  {
    super(model)
  }

  async update1(document: any): Promise<ITimeSlots[]> {
    for (let item of document) {
      await super.change(item)
    }
    return (await this.fetch()) as ITimeSlots[]
  }
}
