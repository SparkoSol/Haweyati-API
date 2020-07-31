import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
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

  async create(data: any): Promise<any> {
    const profile = await this.fetchFromContact(data.contact)
    if (profile) {
      if (profile.scope.includes(data.scope[0])) return null
      else {
        profile.scope.push(data.scope[0])
        return await this.change(profile)
      }
    } else {
      return await super.create(data)
    }
  }

  async fetch(id?: string): Promise<IPerson[] | IPerson> {
    if (id) {
      const data = await this.model.findById(id).exec()
      console.log(data)
      data.password = ''
      return data
    } else {
      const all = await this.model.find().exec()

      for (let data of all) {
        data.password = ''
      }
      return all
    }
  }

  fetchByUsername(name: string): Promise<IPerson> {
    return this.model
      .findOne()
      .where('username', name)
      .exec()
  }

  async change(document: any): Promise<any> {
    if (document.password) {
      const person = (await this.model.findById(document._id).exec()) as IPerson
      if (person.password == document.old) {
        person.password = document.password
        return super.change(document)
      } else {
        throw new HttpException(
          'Old Password Not Matched!',
          HttpStatus.NOT_ACCEPTABLE
        )
      }
    }
  }
}
