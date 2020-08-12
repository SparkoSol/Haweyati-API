import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IServicesRequests} from "../../data/interfaces/serviceRequests.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { PersonsService } from '../persons/persons.service'
import * as blake2 from 'blake2'
import { AdminNotificationsService } from '../admin-notifications/admin-notifications.service'

@Injectable()
export class ServiceRequestsService extends SimpleService<IServicesRequests>{
   constructor(
     @InjectModel('servicerequests')
     protected readonly model : Model<IServicesRequests>,
     protected readonly personsService: PersonsService,
     protected readonly adminNotificationsService: AdminNotificationsService
   )
   {
      super(model);
   }

   async fetch(id?: string): Promise<IServicesRequests[] | IServicesRequests> {
      if (id) {
         const data = await this.model.findById(id).populate('suppliers').exec()
         // @ts-ignore
         data.suppliers.person = await this.personsService.fetch(data.suppliers.person)
         return data
      }
      else{
         return this.getByStatus()
      }
   }

   protected getRandomArbitrary() {
      return (Math.random() * (999999 - 100000) + 100000).toFixed(0);
   }

   create(document: IServicesRequests): Promise<IServicesRequests> {
      let code = this.getRandomArbitrary();
      code = code+Date.now().toString()
      const h = blake2.createHash('blake2b', {digestLength: 3});
      h.update(Buffer.from(code));
      document.requestNo = h.digest("hex")
      const serviceRequest = super.create(document)

      //notification for admin
      if (serviceRequest){
         const notification = {
            type: 'Service',
            title: 'New Service Request',
            message: 'New Service Request with id : '+ document.requestNo +'.'
         }
         this.adminNotificationsService.create(notification);
      }
      return serviceRequest
   }

   async getByStatus(status?: string): Promise<IServicesRequests[]>{
      let all
      if (status) all = await this.model.find({status}).populate('suppliers').exec()
      else all = await this.model.find().populate('suppliers').exec()

      for (let data of all){
         // @ts-ignore
         data.suppliers.person = await this.personsService.fetch(data.suppliers.person)
      }
      return all
   }

   async Pending(){
      return await this.getByStatus('Pending');

   }

   async Rejected(id? : string){
      if (id) return await this.model.findByIdAndUpdate(id, {status: 'Rejected'}).exec()
      else return await this.getByStatus('Rejected')
   }

   async Completed(id? : string){
      if (id) return await this.model.findByIdAndUpdate(id, {status: 'Completed'}).exec()
      else return await this.getByStatus('Completed');
   }

   async getBySupplier(id:string){
      return this.model.find({ suppliers: id }).exec();
   }

   async search(query : any){
      const data = await this.model
        .find({$or: [{'requestNo': { $regex: query.name, $options: "i" }},
              {'type': { $regex: query.name, $options: "i" }}
           ], status : 'Pending'})
        .populate('suppliers').exec();
      for (let item of data){
         // @ts-ignore
         item.suppliers.person = await this.personsService.fetch(item.suppliers.person)
      }
      return data
   }
}
