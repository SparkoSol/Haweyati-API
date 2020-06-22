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
}
