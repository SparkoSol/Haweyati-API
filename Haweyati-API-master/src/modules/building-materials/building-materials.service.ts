import { Model } from 'mongoose'
import { Injectable } from "@nestjs/common"
import { InjectModel } from '@nestjs/mongoose'
import { SimpleService } from '../../common/lib/simple.service'
import { IBuildingMaterials } from '../../data/interfaces/buildingMaterials.interface'
import { ShopRegistrationService } from '../shop-registration/shop-registration.service'
import { BuildingMaterialCategoryService } from '../building-material-category/building-material-category.service'
import { BuildingMaterialSubCategoryService } from '../building-material-sub-category/building-material-sub-category.service'

@Injectable()
export class BuildingMaterialsService extends SimpleService<
  IBuildingMaterials
> {
  constructor(
    @InjectModel('buildingmaterials')
    protected readonly model: Model<IBuildingMaterials>,
    private readonly service: ShopRegistrationService,
    private readonly categoryService: BuildingMaterialCategoryService,
    private readonly subCategoryService: BuildingMaterialSubCategoryService
  ) {
    super(model)
  }

  async fetch(id?: string): Promise<IBuildingMaterials[] | IBuildingMaterials> {
    if (id)
      return await this.model
        .findOne({ _id: id, status: 'Active' })
        .populate({
          path: 'suppliers',
          model: 'shopregistration',
          populate: {
            path: 'person',
            model: 'persons'
          }
        })
        .exec()
    else
      return await this.model
        .find({ status: 'Active' })
        .populate({
          path: 'suppliers',
          model: 'shopregistration',
          populate: {
            path: 'person',
            model: 'persons'
          }
        })
        .exec()
  }

  async fetchByParentId(id: string): Promise<IBuildingMaterials[]> {
    return await this.model
      .find({ status: 'Active' })
      .where('parent', id)
      .exec()
  }

  async create(document: IBuildingMaterials): Promise<IBuildingMaterials> {
    await this.service.checkPricingAccordingToSuppliers(document)
    return super.create(document)
  }

  async getByCity(city: string, parent: string): Promise<IBuildingMaterials[]> {
    if (city) {
      const data = await this.service.getSupplierIdsFromCityName(
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
          // @ts-ignore
          if (item.suppliers.includes(supplier)) {
            result.add(item)
          }
        }
      }
      return Array.from(result) as IBuildingMaterials[]
    }
  }

  async getSuppliers(id: string): Promise<IBuildingMaterials[]> {
    return await this.model
      .find({ status: 'Active', suppliers: id })
      .populate('parent')
      .exec()
  }

  async remove(id: string): Promise<IBuildingMaterials> {
    return this.model.findByIdAndUpdate(id, { status: 'Inactive' })
  }

  //deleting building material category
  async deleteCategory(id: string): Promise<string> {
    await this.categoryService.remove(id)
    const subCategories = await this.subCategoryService.fetchByParentId(id)
    for (const sc of subCategories) {
      await this.deleteSubCategory(sc._id)
    }
    return 'Category Deleted'
  }

  async deleteSubCategory(id: string): Promise<string> {
    await this.subCategoryService.remove(id)
    const data = await this.fetchByParentId(id)
    for (const item of data) {
      await this.remove(item._id)
    }
    return 'Sub Category Deleted'
  }

  //used in reward points module
  async getDataForRewardPoints(data: any): Promise<IBuildingMaterials[]> {
    return await this.model.find({ _id: { $nin: data } }).exec()
  }
}
