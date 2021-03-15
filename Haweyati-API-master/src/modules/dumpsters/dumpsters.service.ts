import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SimpleService } from 'src/common/lib/simple.service'
import { IDumpster } from '../../data/interfaces/dumpster.interface'
import { ShopRegistrationService } from '../shop-registration/shop-registration.service'

@Injectable()
export class DumpstersService extends SimpleService<IDumpster> {
  constructor(
    @InjectModel('dumpsters')
    protected readonly model: Model<IDumpster>,
    private readonly service: ShopRegistrationService
  ) {
    super(model)
  }

  async fetch(id?: string, withSuppliers?: boolean): Promise<IDumpster[] | IDumpster> {
    if (id && withSuppliers)
      return await this.model
        .findOne({ _id: id, status: 'Active' })
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
        .findOne({ _id: id, status: 'Active' })
        .select('-suppliers')
        .exec()
    else
      return await this.model
        .find({ status: 'Active' })
        .select('-suppliers')
        .exec()
  }

  async new(id?: string, withSuppliers?: boolean, city?: string): Promise<IDumpster[] | IDumpster> {
    const query = {}
    const projection = {}
    let populate: any = ''

    query['status'] = 'Active'

    if (city) {
      query['pricing.city'] = city

      projection['description'] = 1
      projection['status'] = 1
      projection['image'] = 1
      projection['name'] = 1
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

  async create(document: IDumpster): Promise<IDumpster> {
    await this.service.checkPricingAccordingToSuppliers(document)
    return super.create(document);
  }

  async fromSuppliers(id: string): Promise<IDumpster[]> {
    return await this.model.find({ status: 'Active', suppliers: id }).exec()
  }

  async getByCity(city: string): Promise<IDumpster[]> {
    const suppliers = await this.service.getSupplierIdsFromCityName(
      city,
      'Construction Dumpster'
    )
    const result = new Set()

    for (const supplier of suppliers) {
      const dumpsters = await this.model.find({ status: 'Active', suppliers: supplier }).exec()
      dumpsters.forEach(value => {
        result.add(value)
      })
    }

    return Array.from(result) as IDumpster[]
  }

  async remove(id: string): Promise<IDumpster> {
    return await this.model.findByIdAndUpdate(id, { status: 'Inactive' }).exec()
  }
}
