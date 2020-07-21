import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SimpleService } from 'src/common/lib/simple.service';
import { IDumpster } from '../../data/interfaces/dumpster.interface';
import { ShopRegistrationService } from '../shop-registration/shop-registration.service';
import * as fs from 'fs'

@Injectable()
export class DumpstersService extends SimpleService<IDumpster> {
   constructor(
      @InjectModel('dumpsters')
      protected readonly model: Model<IDumpster>,
      private readonly service: ShopRegistrationService
   )
   {
      super(model)
   }

   fetch(id?: string): Promise<IDumpster[] | IDumpster> {
      if (id) return this.model.findOne({_id: id, status: 'Active'}).populate('suppliers').exec()
      return this.model.find({status: 'Active'}).populate('suppliers').exec()
   }

   async fromSuppliers(id: string): Promise<IDumpster[]> {
      const dump = await this.model.find().exec()
      const result = []

      for (const item of dump) {
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         // @ts-ignore
         if (item.suppliers.includes(id)) {
            result.push(item)
         }
      }

      return result;
   }

   async getByCity(city: string): Promise<any>{
      if (city) {
         const data = await this.service.getDataFromCityName(city, "Construction Dumpster");
         const  dump = await this.model.find().exec()
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

   async remove(id: string): Promise<IDumpster>{
      return  await this.model.findByIdAndUpdate(id, {status: 'Inactive'}).exec()
   }

   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
   // async deleteImage(data: any){
   //    const dump = (await this.model.findById(data.dumpster).exec()) as IDumpster
   //    for (let i=0; i<dump.images.length; ++i){
   //       if (dump.images[i].name == data.image){
   //          dump.images.splice(i, 1);
   //          fs.unlinkSync(dump.images[i].path)
   //       }
   //    }
   //    return await super.change(dump);
   // }
}