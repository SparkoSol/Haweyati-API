import { Injectable } from '@nestjs/common'
import { SimpleService } from '../../common/lib/simple.service'
import { IOrdersInterface } from '../../data/interfaces/orders.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { PersonsService } from '../persons/persons.service'

@Injectable()
export class OrdersService extends SimpleService<IOrdersInterface> {
  constructor(
    @InjectModel('orders')
    protected readonly model: Model<IOrdersInterface>,
    protected readonly personsService: PersonsService
  ) {
    super(model)
  }

  async getPerson(data: any): Promise<any> {
    // @ts-ignore
    data.customer.profile = await this.personsService.fetch(
      // @ts-ignore
      data.customer.profile
    )
    return data
  }

  create(document: IOrdersInterface): Promise<IOrdersInterface> {

    return super.create(document)
  }

  async getByCustomerId(id: string): Promise<IOrdersInterface[]>{
    return await this.model.find({customer: id}).exec()
  }

  async fetch(id?: string): Promise<IOrdersInterface[] | IOrdersInterface> {
    if (id) {
      let data = await this.model
        .findById(id)
        .populate('customer')
        .exec()
      data = await this.getPerson(data)
      return data
    } else {
      const all = await this.model
        .find()
        .populate('customer')
        .exec()
      for (let data of all) {
        data = await this.getPerson(data)
      }
      return all
    }
  }

  async getByDateRange(min: string, max: string): Promise<IOrdersInterface[]> {
    const all = await this.model
      .find({ createdAt: { $gte: min, $lt: max } })
      .populate('customer')
      .exec()
    for (let data of all) {
      data = await this.getPerson(data)
    }
    return all
  }

  async updateStatus(id: string, status: string) {
    return await this.model
      .findByIdAndUpdate(id, { status })
      .populate('customer')
      .exec()
  }

  async getByStatus(status: string) {
    const all = await this.model
      .find({ status })
      .populate('customer')
      .exec()
    for (let data of all) {
      data = await this.getPerson(data)
    }
    return all
  }
}
