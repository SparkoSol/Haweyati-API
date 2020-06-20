import { Injectable , Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SimpleService } from 'src/common/lib/simple.service';
import { IDumpster } from '../../data/interfaces/dumpster.interface';
import { IDumpsterAvailability } from '../../data/interfaces/dumpsterAvailability';

@Injectable()
export class DumpsterAvailabilityService extends SimpleService<IDumpsterAvailability> {
  constructor(
    @InjectModel('dumpsterAvailability')
    protected readonly model: Model<IDumpsterAvailability>
  ) {
    super(model)
  }

  fetch(id?: string): Promise<IDumpsterAvailability | IDumpsterAvailability[]> {
    if (id) return this.model.findById(id).populate('dumpster').exec()
    return this.model.find().populate('dumpster').exec()
  }

}
