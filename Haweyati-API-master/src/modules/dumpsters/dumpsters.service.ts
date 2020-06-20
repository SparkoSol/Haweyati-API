import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SimpleService } from 'src/common/lib/simple.service';
import { IDumpster } from '../../data/interfaces/dumpster.interface';

@Injectable()
export class DumpstersService extends SimpleService<IDumpster> {
  constructor(
    @InjectModel('dumpsters')
    protected readonly model: Model<IDumpster>
  ) {
    super(model)
  }
}
