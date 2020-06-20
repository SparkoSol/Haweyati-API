import { Injectable , Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISupplier } from 'src/data/interfaces/supplier.interface';
import { SimpleService } from 'src/common/lib/simple.service';

@Injectable()
export class SuppliersService extends SimpleService<ISupplier> {
  constructor(
    @InjectModel('suppliers')
    protected readonly model: Model<ISupplier>
  ) {
    super(model)

  }

}
