import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { IUnit } from '../../data/interfaces/unit.interface'
import { SimpleService } from '../../common/lib/simple.service'

@Injectable()
export class UnitService extends SimpleService<IUnit> {
  constructor(@InjectModel('unit') protected readonly model: Model<IUnit>) {
    super(model)
  }

  async findFromName(name: string): Promise<IUnit> {
    return await this.model.findOne({ name }).exec()
  }
}
