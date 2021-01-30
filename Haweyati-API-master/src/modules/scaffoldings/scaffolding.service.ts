import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SimpleService } from '../../common/lib/simple.service'
import { IScaffoldingInterface } from '../../data/interfaces/scaffolding.interface'
import { IShopRegistration } from '../../data/interfaces/shop-registration.interface'
import { ShopRegistrationService } from '../shop-registration/shop-registration.service'

@Injectable()
export class ScaffoldingService extends SimpleService<IScaffoldingInterface> {
  constructor(
    @InjectModel('scaffoldings')
    protected readonly model: Model<IScaffoldingInterface>,
    private readonly service: ShopRegistrationService
  ) {
    super(model)
  }

  async fetch(
    id?: string
  ): Promise<IScaffoldingInterface[] | IScaffoldingInterface> {
    if (id) {
      const data = await this.model.findById(id).exec()
      for (let i = 0; i < data.suppliers.length; ++i) {
        data.suppliers[i] = (await this.service.fetch(
          data.suppliers[i].toString()
        )) as IShopRegistration
      }
      return data
    } else {
      const all = await this.model.find().exec()
      for (const data of all) {
        for (let i = 0; i < data.suppliers.length; ++i) {
          data.suppliers[i] = (await this.service.fetch(
            data.suppliers[i].toString()
          )) as IShopRegistration
        }
      }
      return all
    }
  }

  async change(document: IScaffoldingInterface): Promise<IScaffoldingInterface> {
    console.log(document)
    return super.change(document);
  }

  async getSuppliers(id: string): Promise<any> {
    const dump = await this.model.find().exec()
    const result = []
    for (const item of dump) {
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
        'Scaffolding'
      )
      const scaffolding = await this.model.find().exec()
      const result = new Set()

      for (const item of scaffolding) {
        for (const supplier of data) {
          if (item.suppliers.includes(supplier)) {
            result.add(item)
          }
        }
      }
      return Array.from(result)
    }
  }
}
