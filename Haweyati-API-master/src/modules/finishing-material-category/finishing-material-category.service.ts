import { Injectable } from '@nestjs/common'
import { SimpleService } from '../../common/lib/simple.service'
import { IFinishingMaterialCategory } from '../../data/interfaces/finishingMaterialCategory.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ImageConversionUtils } from '../../common/lib/image-conversion-utils'

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

  async create(document: IFinishingMaterialCategory): Promise<IFinishingMaterialCategory> {
    const fmc = await super.create(document)
    if (document.image){
      await ImageConversionUtils.toWebp(process.cwd()+"\\"+fmc.image.path, process.cwd()+"\\..\\uploads\\"+fmc.image.name, 20)
    }
    return fmc
  }

  async change(document: IFinishingMaterialCategory): Promise<IFinishingMaterialCategory> {
    const fmc = await super.change(document)
    if (document.image){
      await ImageConversionUtils.toWebp(process.cwd()+"\\"+fmc.image.path, process.cwd()+"\\..\\uploads\\"+fmc.image.name, 20)
    }
    return fmc
  }

  async remove(id: string): Promise<any> {
    return await this.model.findByIdAndUpdate(id, { status: 'Inactive' }).exec()
  }
}
