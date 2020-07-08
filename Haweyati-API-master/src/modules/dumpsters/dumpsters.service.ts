import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SimpleService } from 'src/common/lib/simple.service';
import { IDumpster } from '../../data/interfaces/dumpster.interface';
import { ShopRegistrationService } from '../shop-registration/shop-registration.service';

@Injectable()
export class DumpstersService extends SimpleService<IDumpster> {
  constructor(
    @InjectModel('dumpsters')
    protected readonly model: Model<IDumpster>,
    private readonly service: ShopRegistrationService
  ) {
    super(model)
  }

  fetch(id?: string): Promise<IDumpster[] | IDumpster> {
    if (id) return this.model.findById(id).populate('suppliers').exec()
    return this.model.find().exec()
  }

  async getByCity(city: string): Promise<any>{
    if (city) {
      const data = await this.service.getDataFromCityName(city, "Construction Dumpster");
      const  dump = await this.model.find().exec()
      const result = [];

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

}