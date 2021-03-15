import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SimpleService } from '../../common/lib/simple.service'
import { dtoFinishingMaterialData } from '../../data/dtos/finishing-material.dto'
import { IFinishingMaterial } from '../../data/interfaces/finishingMaterials.interface'
import { ShopRegistrationService } from '../shop-registration/shop-registration.service'
import { IFinishingMaterialCategory } from '../../data/interfaces/finishingMaterialCategory.interface'
import { FinishingMaterialCategoryService } from '../finishing-material-category/finishing-material-category.service'

@Injectable()
export class FinishingMaterialsService extends SimpleService<IFinishingMaterial> {
  constructor(
    @InjectModel('finishingmaterials')
    protected readonly model: Model<IFinishingMaterial>,
    private readonly service: ShopRegistrationService,
    private readonly categoryService: FinishingMaterialCategoryService
  ) {
    super(model)
  }

  async new(id?: string, withSuppliers?: boolean, city?: string): Promise<IFinishingMaterial[] | IFinishingMaterial> {
    const query = {}
    const projection = {}
    let populate: any = ''

    query['status'] = 'Active'

    if (city) {
      projection['description'] = 1
      projection['varient'] = 1
      projection['status'] = 1
      projection['parent'] = 1
      projection['name'] = 1
      projection['price'] = 1
      projection['volumetricWeight'] = 1
      projection['cbmLength'] = 1
      projection['cbmWidth'] = 1
      projection['cbmHeight'] = 1
      projection['options'] = 1
      projection['image'] = 1

      const suppliers = await this.service.getSupplierIdsFromCityName(city, 'Finishing Material')
      query['suppliers'] = {$in: suppliers}
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

  async fetch(
    id?: string, withSuppliers?: boolean
  ): Promise<IFinishingMaterial[] | IFinishingMaterial> {
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

  fetchByParentId(parent: string): Promise<IFinishingMaterial[]> {
    return this.model
      .find({ status: 'Active', parent })
      .exec()
  }

  async getByCity(city: string, parent: string): Promise<IFinishingMaterial[]> {
    const suppliers = await this.service.getSupplierIdsFromCityName(
      city,
      'Finishing Material'
    )
    const result = new Set()

    for (const supplier of suppliers) {
      const fm = await this.model.find({ status: 'Active', parent, suppliers: supplier }).exec()
      fm.forEach(value => {
        result.add(value)
      })
    }

    return Array.from(result) as IFinishingMaterial[]
  }

  async getByParentSupplier(parent: string, supplier: string): Promise<IFinishingMaterial[]> {
    return await this.model
      .find({ status: 'Active', parent, suppliers: supplier })
      .exec()
  }

  async getSuppliers(supplier: string): Promise<IFinishingMaterial[]> {
    return await this.model.find({ status: 'Active', suppliers: supplier }).populate('parent').exec()
  }

  async remove(id: string): Promise<IFinishingMaterial> {
    return await this.model.findByIdAndUpdate(id, { status: 'Inactive' }).exec()
  }

  async deleteCategory(id: string): Promise<string> {
    await this.categoryService.remove(id)
    const data = await this.fetchByParentId(id)
    for (const item of data) {
      await this.remove(item._id)
    }
    return 'Category Deleted'
  }

  async search(name: string, parent: string, supplier: string): Promise<IFinishingMaterial[]> {
    return await this.model
      .find({ status: 'Active', parent, suppliers: supplier, name: { $regex: name, $options: 'i' } })
      .populate('suppliers')
      .exec()
  }

  async fetchAndSearch(id: string, data: dtoFinishingMaterialData): Promise<IFinishingMaterial[]> {
    return await this.model
      .find({
        parent: id,
        $or: [{ name: { $regex: data.name, $options: 'i' } }]
      })
      .populate('parent')
      .exec()
  }

  //used in reward points module
  async getDataForRewardPoints(data: any[]): Promise<IFinishingMaterial[]> {
    return await this.model.find({ _id: { $nin: data } }).exec()
  }

  async getCategoriesFromSupplier(id: string): Promise<IFinishingMaterialCategory[]> {
    const myResult = new Set()
    const fm = await this.model.find({ suppliers: id }).populate('parent').exec() as IFinishingMaterial[]
    for (const item of fm) {
      myResult.add(item.parent)
    }
    return Array.from(myResult) as IFinishingMaterialCategory[]
  }
}
