import { Injectable } from '@nestjs/common';
import { SimpleService } from '../../common/lib/simple.service';
import { IFinishingMaterialCategory } from '../../data/interfaces/finishingMaterialCategory.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FinishingMaterialCategoryService extends SimpleService<IFinishingMaterialCategory>{
  constructor(
    @InjectModel('finishingmaterialcategory')
    protected readonly model: Model<IFinishingMaterialCategory>
  )
  {
    super(model);
  }

  fetch(id?: string): Promise<IFinishingMaterialCategory[] | IFinishingMaterialCategory> {
    if (id) return this.model.find({_id: id, status: 'Active'}).exec()
    else return this.model.find({status: 'Active'}).exec()
  }

  async remove(id: string): Promise<any> {
    return await this.model.findByIdAndUpdate(id, {status: 'Inactive'}).exec();
  }

}
