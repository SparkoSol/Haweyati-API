import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SimpleService } from '../../common/lib/simple.service'
import { IBuildingMaterials } from '../../data/interfaces/buildingMaterials.interface'
import { ShopRegistrationService } from '../shop-registration/shop-registration.service'
import { BuildingMaterialCategoryService } from '../building-material-category/building-material-category.service'
import { BuildingMaterialSubCategoryService } from '../building-material-sub-category/building-material-sub-category.service'
import { IDumpster } from "../../data/interfaces/dumpster.interface";

@Injectable()
export class BuildingMaterialsService extends SimpleService<IBuildingMaterials> {
  constructor(
    @InjectModel('buildingmaterials')
    protected readonly model: Model<IBuildingMaterials>,
    private readonly service: ShopRegistrationService,
    private readonly categoryService: BuildingMaterialCategoryService,
    private readonly subCategoryService: BuildingMaterialSubCategoryService
  ) {
    super(model)
  }

  async new(id?: string, withSuppliers?: boolean, city?: string): Promise<IBuildingMaterials[] | IBuildingMaterials> {
    const query = {}
    const projection = {}
    let populate: any = ''

    query['status'] = 'Active'

    if (city) {
      query['pricing.city'] = city

      projection['description'] = 1
      projection['status'] = 1
      projection['image'] = 1
      projection['parent'] = 1
      projection['name'] = 1
      projection['pricing'] = { $elemMatch: { city: city } }
    }

    if (withSuppliers) {
      populate = {
        path: 'suppliers',
        model: 'shopregistration',
        populate: {
          path: 'person',
          model: 'persons'
        }
      }
    }
    else if (Object.keys(projection).length === 0) {
      projection['suppliers'] = 0
    }

    if (id) {
      query['_id'] = id;
      return this.model.findOne(query, projection).populate(populate).exec()
    } else {
      return this.model.find(query, projection).populate(populate).exec();
    }
  }

  async fetch(id?: string, withSuppliers?: boolean): Promise<IBuildingMaterials[] | IBuildingMaterials> {
    if (id && withSuppliers)
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
    else if (id)
      return await this.model
        .findOne({ _id: id, status: 'Active' })
        .select('-suppliers')
        .exec()
    else
      return await this.model
        .find({ status: 'Active' })
        .select('-suppliers')
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
      const suppliers = await this.service.getSupplierIdsFromCityName(
        city,
        'Building Material'
      )

      const result = new Set()

      for (const supplier of suppliers) {
        const bm = await this.model
          .find({ status: 'Active', parent, suppliers: supplier })
          .exec()
        bm.forEach(value => {
          result.add(value)
        })
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
}
