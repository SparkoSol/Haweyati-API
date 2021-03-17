import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { IUnit } from '../../data/interfaces/unit.interface'
import { SimpleService } from '../../common/lib/simple.service'
import { IPointValue } from '../../data/interfaces/pointValue.interface'

@Injectable()
export class UnitService extends SimpleService<IUnit> {
  constructor(
    @InjectModel('unit') protected readonly model: Model<IUnit>,
    @InjectModel('pointValue')
    protected readonly pointValueModel: Model<IPointValue>
  ) {
    super(model)
  }

  async findFromName(name: string): Promise<IUnit> {
    return await this.model.findOne({ name }).exec()
  }

  async getValue(): Promise<IPointValue> {
    return await this.pointValueModel.findOne().exec()
  }

  async updateValue(value: IPointValue): Promise<IPointValue> {
    const x = await this.pointValueModel.findOne().exec()
    if (x)
      return await this.pointValueModel.findByIdAndUpdate(x._id, value).exec()
    else return await this.pointValueModel.create(value)
  }
}
