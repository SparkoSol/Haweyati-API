import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { SimpleService } from 'src/common/lib/simple.service'
import { IDumpster } from '../../data/interfaces/dumpster.interface'
import { ShopRegistrationService } from '../shop-registration/shop-registration.service'
import { IShopRegistrationInterface } from '../../data/interfaces/shop-registration.interface'

@Injectable()
export class DumpstersService extends SimpleService<IDumpster> {
  constructor(
    @InjectModel('dumpsters')
    protected readonly model: Model<IDumpster>,
    private readonly service: ShopRegistrationService
  )
  {
    super(model)
  }

  async fetch(id?: string): Promise<IDumpster[] | IDumpster> {
    if (id) {
      let data = await this.model.findOne({ _id: id, status: 'Active' }).exec()
      for (let i = 0; i < data.suppliers.length; ++i) {
        data.suppliers[i] = (await this.service.fetch(
          data.suppliers[i].toString()
        )) as IShopRegistrationInterface
      }
      return data
    } else {
      let big = await this.model.find({ status: 'Active' }).exec()
      for (let data of big) {
        for (let i = 0; i < data.suppliers.length; ++i) {
          data.suppliers[i] = (await this.service.fetch(
            data.suppliers[i].toString()
          )) as IShopRegistrationInterface
        }
      }
      return big
    }
  }

  async fromSuppliers(id: string): Promise<IDumpster[]> {
    const dump = await this.model.find({ status: 'Active' }).exec()
    const result = []

    for (const item of dump) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (item.suppliers.includes(id)) {
        result.push(item)
      }
    }

    return result
  }

  async getByCity(city: string): Promise<any> {
    if (city) {
      const data = await this.service.getDataFromCityName(
        city,
        'Construction Dumpster'
      )
      const dump = await this.model.find().exec()
      const result = []

      for (const item of dump) {
        for (const supplier of data) {
          if (item.suppliers.includes(supplier)) {
            result.push(item)
          }
        }
      }
      return result
    }
  }

  async remove(id: string): Promise<IDumpster> {
    return await this.model.findByIdAndUpdate(id, { status: 'Inactive' }).exec()
  }
}
