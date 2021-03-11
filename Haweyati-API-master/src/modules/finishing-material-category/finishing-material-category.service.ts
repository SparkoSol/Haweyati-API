import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SimpleService } from '../../common/lib/simple.service'
import { IFinishingMaterialCategory } from '../../data/interfaces/finishingMaterialCategory.interface'

@Injectable()
export class FinishingMaterialCategoryService extends SimpleService<
  IFinishingMaterialCategory
> {
  constructor(
    @InjectModel('finishingmaterialcategory')
    protected readonly model: Model<IFinishingMaterialCategory>
  ) {
    super(model)
  }

  fetch(
    id?: string
  ): Promise<IFinishingMaterialCategory[] | IFinishingMaterialCategory> {
    if (id) return this.model.findOne({ _id: id, status: 'Active' }).exec()
    else return this.model.find({ status: 'Active' }).exec()
  }

  async remove(id: string): Promise<IFinishingMaterialCategory> {
    return await this.model.findByIdAndUpdate(id, { status: 'Inactive' }).exec()
  }
}
