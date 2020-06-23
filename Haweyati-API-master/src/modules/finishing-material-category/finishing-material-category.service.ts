import { Injectable } from '@nestjs/common';
import { SimpleService } from '../../common/lib/simple.service';
import { IFinishingMaterialCategory } from '../../data/interfaces/finishingMaterialCategory.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FinishingMaterialCategoryService extends SimpleService<IFinishingMaterialCategory>{
  constructor(@InjectModel('finishingmaterialcategory') protected readonly model: Model<IFinishingMaterialCategory>) {
    super(model);
  }
}
