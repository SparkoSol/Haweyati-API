import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SimpleService } from '../../common/lib/simple.service'
import { IScaffolding } from '../../data/interfaces/scaffolding.interface'
import { IShopRegistration } from '../../data/interfaces/shop-registration.interface'
import { ShopRegistrationService } from '../shop-registration/shop-registration.service'

@Injectable()
export class ScaffoldingService extends SimpleService<IScaffolding> {
  constructor(
    @InjectModel('scaffoldings')
    protected readonly model: Model<IScaffolding>,
    private readonly service: ShopRegistrationService
  ) {
    super(model)
  }

  async fetch(
    id?: string
  ): Promise<IScaffolding[] | IScaffolding> {
    if (id)
      return await this.model
        .findById(id)
        .populate('suppliers')
        .exec()
    else
      return await this.model
        .find()
        .populate('suppliers')
        .exec()
  }

  async getSuppliers(id: string): Promise<IScaffolding[]> {
    return await this.model.find({suppliers: id}).exec()
  }

  async getByCity(city: string): Promise<IScaffolding[]> {
    if (city) {
      const suppliers = await this.service.getSupplierIdsFromCityName(
        city,
        'Scaffolding'
      )
      const result = new Set()

      for (const supplier of suppliers){
        result.add(await this.model.find({status: 'Active', suppliers: supplier}).exec())
      }

      return Array.from(result) as IScaffolding[]
    }
  }
}
