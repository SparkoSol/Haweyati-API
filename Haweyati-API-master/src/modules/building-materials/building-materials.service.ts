import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IBuildingMaterialsInterface} from "../../data/interfaces/buildingMaterials.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { ShopRegistrationService } from '../shop-registration/shop-registration.service';
import { BuildingMaterialCategoryService } from "../building-material-category/building-material-category.service";
import { IBuildingMaterialCategory } from "../../data/interfaces/buildingMaterialCategory.interface";

@Injectable()
export class BuildingMaterialsService extends SimpleService<IBuildingMaterialsInterface>{
    constructor(
      @InjectModel('buildingmaterials')
      protected readonly model: Model<IBuildingMaterialsInterface>,
      private readonly service: ShopRegistrationService,
      private readonly categoryService: BuildingMaterialCategoryService
    ) {
        super(model);
    }

    fetch(id?: string): Promise<IBuildingMaterialsInterface[] | IBuildingMaterialsInterface> {
        if (id) return this.model.findOne({_id: id, status: 'Active'}).populate('suppliers').exec()
        return this.model.find({status: 'Active'}).exec()
    }

    async fetchByParentId(id: string): Promise<IBuildingMaterialsInterface[]>{
        return await this.model.find({status: 'Active'}).where('parent', id).exec();
    }

    async getByCity(city: string, parent: string): Promise<any>{
        if (city) {
            const data = await this.service.getDataFromCityName(city, "Building Material");
            const dump = await this.model.find({status: 'Active'}).where('parent', parent).exec()

            const result = [];

            for (const item of dump) {
                for (const supplier of data) {
                    if (item.suppliers.includes(supplier)) {
                        result.push(item)
                    }
                }
            }
            return result
        }
    }

    async getSuppliers(id: string): Promise<any>{
        const dump = await this.model.find({status: 'Active'}).exec()
        const result = []

        for (const item of dump) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (item.suppliers.includes(id)) {
                item.parent = (await this.categoryService.fetch(item.parent.toString())) as IBuildingMaterialCategory
                result.push(item)
            }
        }
        return result;
    }

    async remove(id: string): Promise<any> {
        return await this.model.findByIdAndUpdate(id, {status: 'Inactive'});
    }

    async deleteCategory(id: string): Promise<any>{
        await this.categoryService.remove(id);
        const data = await this.fetchByParentId(id);
        for (const item of data){
            await this.remove(item._id);
        }
        return 'Category Deleted'
    }

}
