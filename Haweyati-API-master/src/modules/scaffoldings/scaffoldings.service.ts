import { Injectable } from '@nestjs/common'
import { SimpleService } from '../../common/lib/simple.service'
import { IScaffoldingsInterface } from '../../data/interfaces/scaffoldings.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ShopRegistrationService } from '../shop-registration/shop-registration.service'
import { IShopRegistrationInterface } from '../../data/interfaces/shop-registration.interface'

@Injectable()
export class ScaffoldingsService extends SimpleService<IScaffoldingsInterface> {
  constructor(
    @InjectModel('scaffoldings')
    protected readonly model: Model<IScaffoldingsInterface>,
    private readonly service: ShopRegistrationService
  ) {
    super(model)
  }

  async fetch(
    id?: string
  ): Promise<IScaffoldingsInterface[] | IScaffoldingsInterface> {
    if (id) {
      const data = await this.model.findById(id).exec()
      for (let i = 0; i < data.suppliers.length; ++i) {
        data.suppliers[i] = (await this.service.fetch(
          data.suppliers[i].toString()
        )) as IShopRegistrationInterface
      }
      return data
    } else {
      const all = await this.model.find().exec()
      for (let data of all) {
        for (let i = 0; i < data.suppliers.length; ++i) {
          data.suppliers[i] = (await this.service.fetch(
            data.suppliers[i].toString()
          )) as IShopRegistrationInterface
        }
      }
      return all
    }
  }
}
