import { Injectable } from '@nestjs/common'
import { SimpleService } from '../../common/lib/simple.service'
import { IBuildingMaterialCategory } from '../../data/interfaces/buildingMaterialCategory.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ImageConversionUtils } from '../../common/lib/image-conversion-utils'

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

  async create(document: IBuildingMaterialCategory): Promise<IBuildingMaterialCategory> {
    const bmc = await super.create(document)
    if (bmc.image){
      await ImageConversionUtils.toWebp(process.cwd()+"\\"+bmc.image.path, process.cwd()+"\\..\\uploads\\"+bmc.image.name, 20)
    }
    return bmc
  }

  async change(document: IBuildingMaterialCategory): Promise<IBuildingMaterialCategory> {
    const bmc = await super.change(document)
    if (document.image){
      await ImageConversionUtils.toWebp(process.cwd()+"\\"+bmc.image.path, process.cwd()+"\\..\\uploads\\"+bmc.image.name, 20)
    }
    return bmc
  }

  async remove(id: string): Promise<any> {
    return await this.model.findByIdAndUpdate(id, { status: 'Inactive' }).exec()
  }
}
