import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SimpleService } from '../../common/lib/simple.service'
import { IShopRegistration } from '../../data/interfaces/shop-registration.interface'
import { IBuildingMaterials } from '../../data/interfaces/buildingMaterials.interface'
import { ShopRegistrationService } from '../shop-registration/shop-registration.service'
import { IBuildingMaterialCategory } from '../../data/interfaces/buildingMaterialCategory.interface'
import { BuildingMaterialCategoryService } from '../building-material-category/building-material-category.service'

@Injectable()
export class BuildingMaterialsService extends SimpleService<
  IBuildingMaterials
> {
  constructor(
    @InjectModel('buildingmaterials')
    protected readonly model: Model<IBuildingMaterials>,
    private readonly service: ShopRegistrationService,
    private readonly categoryService: BuildingMaterialCategoryService
  ) {
    super(model)
  }

  async fetch(id?: string): Promise<IBuildingMaterials[] | IBuildingMaterials> {
    if (id) {
      let data = await this.model.findOne({ _id: id, status: 'Active' }).exec()
      for (let i = 0; i < data.suppliers.length; ++i) {
        data.suppliers[i] = (await this.service.fetch(
          data.suppliers[i].toString()
        )) as IShopRegistration
      }
      return data
    } else {
      let big = await this.model.find({ status: 'Active' }).exec()
      for (let data of big) {
        for (let i = 0; i < data.suppliers.length; ++i) {
          data.suppliers[i] = (await this.service.fetch(
            data.suppliers[i].toString()
          )) as IShopRegistration
        }
      }
      return big
    }
  }

  async fetchByParentId(id: string): Promise<IBuildingMaterials[]> {
    return await this.model
      .find({ status: 'Active' })
      .where('parent', id)
      .exec()
  }

  async getByCity(city: string, parent: string): Promise<any> {
    if (city) {
      const data = await this.service.getDataFromCityName(
        city,
        'Building Material'
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
        )) as IBuildingMaterialCategory
        result.push(item)
      }
    }
    return result
  }

  async remove(id: string): Promise<any> {
    return this.model.findByIdAndUpdate(id, { status: 'Inactive' })
  }

  //deleting building material category
  async deleteCategory(id: string): Promise<any> {
    await this.categoryService.remove(id)
    const data = await this.fetchByParentId(id)
    for (const item of data) {
      await this.remove(item._id)
    }
    return 'Category Deleted'
  }

  //used in reward points module
  async getDataForRewardPoints(data: any): Promise<IBuildingMaterials[]> {
    return await this.model.find({ _id: { $nin: data } }).exec()
  }
}
