import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SimpleService } from '../../common/lib/simple.service'
import { IBuildingMaterialCategory } from '../../data/interfaces/buildingMaterialCategory.interface'

@Injectable()
export class BuildingMaterialCategoryService extends SimpleService<
  IBuildingMaterialCategory
> {
  constructor(
    @InjectModel('buildingmaterialcategory')
    protected readonly model: Model<IBuildingMaterialCategory>
  ) {
    super(model)
  }

  fetch(
    id?: string
  ): Promise<IBuildingMaterialCategory[] | IBuildingMaterialCategory> {
    if (id) return this.model.findOne({ _id: id, status: 'Active' }).exec()
    else return this.model.find({ status: 'Active' }).exec()
  }

  async remove(id: string): Promise<IBuildingMaterialCategory> {
    return await this.model.findByIdAndUpdate(id, { status: 'Inactive' }).exec()
  }
}
