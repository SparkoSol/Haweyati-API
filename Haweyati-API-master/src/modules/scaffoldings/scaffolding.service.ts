import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SimpleService } from '../../common/lib/simple.service'
import { IScaffolding } from '../../data/interfaces/scaffolding.interface'
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

  async new(id?: string, withSuppliers?: boolean, city?: string): Promise<IScaffolding[] | IScaffolding> {
    const query = {}
    const projection = {}
    let populate: any = ''

    if (city) {
      query['pricing.city'] = city

      projection['description'] = 1
      projection['name'] = 1
      projection['volumetricWeight'] = 1
      projection['cbmLength'] = 1
      projection['cbmWidth'] = 1
      projection['cbmHeight'] = 1
      projection['pricing'] = { $elemMatch: { city: city } }
    }

    if (withSuppliers) {
      populate = {
        path: 'suppliers',
        model: 'shopregistration',
        populate: {
          path: 'person',
          model: 'persons'
        }
      }
    } else if (Object.keys(projection).length === 0) {
      projection['suppliers'] = 0
    }

    if (id) {
      query['_id'] = id;
      return this.model.findOne(query, projection).populate(populate).exec()
    } else {
      return this.model.find(query, projection).populate(populate).exec();
    }
  }

  async fetch(
    id?: string, withSuppliers?: boolean
  ): Promise<IScaffolding[] | IScaffolding> {
    if (id && withSuppliers)
      return await this.model
        .findOne({ _id: id })
        .populate({
          path: 'suppliers',
          model: 'shopregistration',
          populate: {
            path: 'person',
            model: 'persons'
          }
        })
        .exec()
    else if (id)
      return await this.model
        .findOne({ _id: id })
        .select('-suppliers')
        .exec()
    else
      return await this.model
        .find()
        .select('-suppliers')
        .exec()
  }

  async getSuppliers(id: string): Promise<IScaffolding[]> {
    return await this.model.find({ suppliers: id }).exec()
  }

  async getByCity(city: string): Promise<IScaffolding[]> {
    if (city) {
      const suppliers = await this.service.getSupplierIdsFromCityName(
        city,
        'Scaffolding'
      )
      const result = new Set()

      for (const supplier of suppliers) {
        const scaffolding = await this.model.find({ suppliers: supplier }).exec()
        scaffolding.forEach(value => {
          result.add(value)
        })
      }

      return Array.from(result) as IScaffolding[]
    }
  }
}
