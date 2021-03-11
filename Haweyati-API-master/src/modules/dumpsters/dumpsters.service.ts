import { Model } from 'mongoose'
import { Injectable } from "@nestjs/common"
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

  async fetch(id?: string): Promise<IDumpster[] | IDumpster> {
    if (id)
      return await this.model
        .findOne({ _id: id, status: 'Active' })
        .populate('suppliers')
        .exec()
    else
      return await this.model
        .find({ status: 'Active' })
        .populate('suppliers')
        .exec()
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

    for (const supplier of suppliers){
      result.add(await this.model.find({status: 'Active', suppliers: supplier}).exec())
    }

    return Array.from(result) as IDumpster[]
  }

  async remove(id: string): Promise<IDumpster> {
    return await this.model.findByIdAndUpdate(id, { status: 'Inactive' }).exec()
  }
}
