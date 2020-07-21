import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IServicesRequests} from "../../data/interfaces/serviceRequests.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class ServiceRequestsService extends SimpleService<IServicesRequests>{
   constructor(@InjectModel('servicerequests') protected readonly model : Model<IServicesRequests>) {
      super(model);
   }

   async fetch(id?: string): Promise<IServicesRequests[] | IServicesRequests> {
      if (id) return await this.model.findById(id).populate('suppliers').exec()
      else return this.model.find().populate('suppliers').exec()
   }

   async Pending(){
      return await this.model.find({status: 'Pending'}).populate('suppliers').exec()
   }

   async Rejected(id? : string){
      if (id) return await this.model.findByIdAndUpdate(id, {status: 'Rejected'}).exec()
      else return await this.model.find({status : 'Rejected'}).populate('suppliers').exec()
   }

   async Completed(id? : string){
      if (id) return await this.model.findByIdAndUpdate(id, {status: 'Completed'}).exec()
      else return await this.model.find({status : 'Completed'}).populate('suppliers').exec()
   }

   async getBySupplier(id:string){
      return this.model.find({ suppliers: id }).exec();
   }

}
