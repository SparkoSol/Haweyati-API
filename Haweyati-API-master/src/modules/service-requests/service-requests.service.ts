import { Model } from "mongoose";
import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { PersonsService } from '../persons/persons.service'
import { SimpleService } from "../../common/lib/simple.service";
import { NoGeneratorUtils } from '../../common/lib/no-generator-utils'
import { IServicesRequests } from "../../data/interfaces/serviceRequests.interface";
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
      else
         return this.getByStatus()
   }

   async create(document: any): Promise<IServicesRequests> {
      const {suppliers, note, type, image, description, ...data} = document

      const serviceReq = {
         suppliers: suppliers,
         type: type,
         description: description,
         data: data,
         note: note,
         image: document.image,
         requestNo: await NoGeneratorUtils.generateCode()
      }
      const serviceRequest = await super.create(<IServicesRequests>serviceReq)

      //notification for admin
      if (serviceRequest){
         const notification = {
            type: 'Service',
            title: 'New Service Request',
            message: 'New Service Request with id : '+ document.requestNo +'.'
         }
         await this.adminNotificationsService.create(notification);
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

   async updateByStatus(id: string, status: string): Promise<IServicesRequests>{
      return await this.model.findByIdAndUpdate(id, {status}).exec()
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
