import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ICity } from '../../data/interfaces/city.interface'
import { SimpleService } from '../../common/lib/simple.service'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

@Injectable()
export class CityService extends SimpleService<ICity> {
  constructor(@InjectModel('city') protected readonly model: Model<ICity>) {
    super(model)
  }

  async create(document: ICity): Promise<ICity> {
    if (!(await this.model.findOne({ name: document.name }).exec()))
      return super.create(document)
    else
      throw new HttpException('City already exist!', HttpStatus.NOT_ACCEPTABLE)
  }
}
