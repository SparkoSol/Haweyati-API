import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IPerson } from 'src/data/interfaces/person.interface'
import { SimpleService } from 'src/common/lib/simple.service'

@Injectable()
export class PersonsService extends SimpleService<any> {
  constructor(
    @InjectModel('persons')
    protected readonly model: Model<IPerson>
  ) {
    super(model)
  }

  async fetchFromContact(contact: string): Promise<IPerson> {
    return await this.model.findOne({ contact: contact }).exec()
  }

  async fetch(id?: string): Promise<IPerson[] | IPerson> {
    if (id) return await this.model.findById(id).exec()
    return await this.model.find().exec()
  }

  fetchByUsername(name: string): Promise<IPerson> {
    return this.model
      .findOne()
      .where('username', name)
      .exec()
  }
}
