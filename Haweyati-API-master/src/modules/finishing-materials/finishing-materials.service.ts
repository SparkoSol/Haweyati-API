import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IFinishingMaterialsInterface} from "../../data/interfaces/finishingMaterials.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { ShopRegistrationService } from '../shop-registration/shop-registration.service';

@Injectable()
export class FinishingMaterialsService extends SimpleService<IFinishingMaterialsInterface>{
   constructor(
      @InjectModel('finishingmaterials')
      protected readonly model: Model<IFinishingMaterialsInterface>,
      private readonly service: ShopRegistrationService
   ) {
      super(model);
   }

   fetch(id?: string): Promise<IFinishingMaterialsInterface[] | IFinishingMaterialsInterface> {
      if (id) return this.model.findById(id).populate('suppliers').exec()
      return this.model.find().exec()
   }

   fetchByParentId(id: string): Promise<IFinishingMaterialsInterface[] | IFinishingMaterialsInterface>{
      return this.model.find().where('parent', id).exec();
   }
   async getByCity(city: string, parent: string): Promise<any>{
      const data = await this.service.getDataFromCityName(city, "Finishing Material");
      const dump = await this.model.find().where('parent', parent).exec()

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
