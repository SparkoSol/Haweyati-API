import { Model } from 'mongoose'
import { Injectable } from "@nestjs/common"
import { InjectModel } from '@nestjs/mongoose'
import { SimpleService } from '../../common/lib/simple.service'
import { ShopRegistrationService } from '../shop-registration/shop-registration.service'
import { IShopRegistration } from '../../data/interfaces/shop-registration.interface'
import { IFinishingMaterials } from '../../data/interfaces/finishingMaterials.interface'
import { IFinishingMaterialCategory } from '../../data/interfaces/finishingMaterialCategory.interface'
import { FinishingMaterialCategoryService } from '../finishing-material-category/finishing-material-category.service'

@Injectable()
export class FinishingMaterialsService extends SimpleService<
  IFinishingMaterials
> {
  constructor(
    @InjectModel('finishingmaterials')
    protected readonly model: Model<IFinishingMaterials>,
    private readonly service: ShopRegistrationService,
    private readonly categoryService: FinishingMaterialCategoryService
  ) {
    super(model)
  }

  async fetch(
    id?: string
  ): Promise<IFinishingMaterials[] | IFinishingMaterials> {
    if (id) {
      const data = await this.model.findOne({ _id: id, status: 'Active' }).exec()
      for (let i = 0; i < data.suppliers.length; ++i) {
        data.suppliers[i] = (await this.service.fetch(
          data.suppliers[i].toString()
        )) as IShopRegistration
      }
      return data
    } else {
      const big = await this.model.find({ status: 'Active' }).exec()
      for (const data of big) {
        for (let i = 0; i < data.suppliers.length; ++i) {
          data.suppliers[i] = (await this.service.fetch(
            data.suppliers[i].toString()
          )) as IShopRegistration
        }
      }
      return big
    }
  }

  fetchByParentId(id: string): Promise<IFinishingMaterials[]> {
    return this.model
      .find({ status: 'Active' })
      .where('parent', id)
      .exec()
  }

  async getByCity(city: string, parent: string): Promise<any> {
    const data = await this.service.getDataFromCityName(
      city,
      'Finishing Material'
    )
    const dump = await this.model
      .find({ status: 'Active' })
      .where('parent', parent)
      .exec()

    const result = new Set()

    for (const item of dump) {
      for (const supplier of data) {
        if (item.suppliers.includes(supplier)) {
          result.add(item)
        }
      }
    }

    return Array.from(result)
  }

  async getByParentSupplier(parent: string, supplier: string): Promise<any> {
    return await this.model
      .find({ status: 'Active', parent, suppliers: supplier})
      .exec()
  }

  async getSuppliers(id: string): Promise<any> {
    const dump = await this.model.find({ status: 'Active' }).exec()
    const result = []

    for (const item of dump) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (item.suppliers.includes(id)) {
        item.parent = (await this.categoryService.fetch(
          item.parent.toString()
        )) as IFinishingMaterialCategory
        result.push(item)
      }
    }
    return result
  }

  async remove(id: string): Promise<any> {
    return await this.model.findByIdAndUpdate(id, { status: 'Inactive' }).exec()
  }

  async deleteCategory(id: string): Promise<any> {
    await this.categoryService.remove(id)
    const data = await this.fetchByParentId(id)
    for (const item of data) {
      await this.remove(item._id)
    }
    return 'Category Deleted'
  }

  async search(name: string, parent: string, supplier: string): Promise<IFinishingMaterials[]> {
    const big = await this.model
      .find({ status: 'Active', parent, suppliers: supplier, name: { $regex: name, $options: 'i' } })
      .exec()
    for (const data of big) {
      for (let i = 0; i < data.suppliers.length; ++i) {
        data.suppliers[i] = (await this.service.fetch(
          data.suppliers[i].toString()
        )) as IShopRegistration
      }
    }
    return big
  }

  async fetchAndSearch(id: string, data: any): Promise<IFinishingMaterials[]> {
    return await this.model
      .find({
        parent: id,
        $or: [{ name: { $regex: data.name, $options: 'i' } }]
      })
      .populate('parent')
      .exec()
  }

  //used in reward points module
  async getDataForRewardPoints(data: any): Promise<IFinishingMaterials[]> {
    return await this.model.find({ _id: { $nin: data } }).exec()
  }

  async getCategoriesFromSupplier(id: string): Promise<IFinishingMaterialCategory[]>{
    const myResult = new Set()
    // @ts-ignore
    const fm = await this.model.find({suppliers: id}).populate('parent').exec() as IFinishingMaterials[]
    for (const item of fm){
      myResult.add(item.parent)
    }
    return Array.from(myResult) as IFinishingMaterialCategory[]
  }
}
