import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { IUnit } from '../../data/interfaces/unit.interface'
import { SimpleService } from '../../common/lib/simple.service'
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { IPointValue } from "../../data/interfaces/pointValue.interface";

@Injectable()
export class UnitService extends SimpleService<IUnit> {
  constructor(
    @InjectModel('unit') protected readonly model: Model<IUnit>,
    @InjectModel('pointValue') protected readonly pointValueModel: Model<IPointValue>
  ) {
    super(model)
  }

  async findFromName(name: string): Promise<IUnit> {
    return await this.model.findOne({ name }).exec()
  }

  async getValue(): Promise<number>{
    return (await this.pointValueModel.findOne().exec()).value
  }

  async addValue(value: number): Promise<number>{
    await this.pointValueModel.create({value})
    return value
  }

  async updateValue(value: number): Promise<number>{
    if (value){
      const x = await this.pointValueModel.findOne().exec()
      if (x)
        await this.pointValueModel.findOneAndUpdate({_id: x._id}, {value}).exec()
      else
        await this.pointValueModel.create({value})
      return value
    }
    else throw new HttpException("Can't update value", HttpStatus.NOT_ACCEPTABLE)
  }
}
