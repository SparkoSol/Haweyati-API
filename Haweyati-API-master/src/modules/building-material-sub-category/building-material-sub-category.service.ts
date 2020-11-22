import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { SimpleService } from '../../common/lib/simple.service'
import { IBuildingMaterialSubCategory } from '../../data/interfaces/buildingMaterialSubCategory.interface'

@Injectable()
export class BuildingMaterialSubCategoryService extends SimpleService<IBuildingMaterialSubCategory>{
  constructor(@InjectModel('buildingmaterialsubcategories') protected readonly model: Model<IBuildingMaterialSubCategory>) {
    super(model);
  }

  fetch(
    id?: string
  ): Promise<IBuildingMaterialSubCategory[] | IBuildingMaterialSubCategory> {
    if (id) return this.model.findOne({ _id: id, status: 'Active' }).exec()
    else return this.model.find({ status: 'Active' }).exec()
  }

  async fetchByParentId(id: string): Promise<IBuildingMaterialSubCategory[]> {
    return await this.model
      .find({ status: 'Active' })
      .where('parent', id)
      .exec()
  }

  async remove(id: string): Promise<any> {
    return await this.model.findByIdAndUpdate(id, { status: 'Inactive' }).exec()
  }

}
