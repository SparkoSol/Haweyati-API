import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {ICustomerInterface} from "../../data/interfaces/customers.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { PersonsService } from '../persons/persons.service';
import { IPerson } from '../../data/interfaces/person.interface';

@Injectable()
export class CustomersService extends SimpleService<ICustomerInterface>{
   constructor(
      @InjectModel('customers')
      protected readonly model: Model<ICustomerInterface>,
      protected readonly personService: PersonsService
   ) {
      super(model);
   }

   async fetch(id?: string): Promise<any> {
      if (id) {
         const data = (await this.model.findById(id).where('status', 'Active').populate('profile').exec()) as ICustomerInterface
         if (data){
            if (data.profile != null){
               // @ts-ignore
               data.profile.username = "";
               // @ts-ignore
               data.profile.password = "";
            }
         }
         return data;
      }
      else {
         const data = await this.model.find().where('status', 'Active').populate('profile').exec() as ICustomerInterface[];
         if (data){
            for (let i = 0; i < data.length; ++i) {
               // @ts-ignore
               data[i].profile.username = "";
               // @ts-ignore
               data[i].profile.password = "";
            }
         }
         return data;
      }
   }

   async getProfile(contact: string): Promise<ICustomerInterface | string>{
      const person = await this.personService.fetchFromContact(contact);
      if (person){
         return await this.model.findOne({profile: person._id}).populate('profile').exec()
      }
      else{
         return "No Data"
      }
   }

   async getAll(id? : string): Promise<ICustomerInterface[] | ICustomerInterface>{
      if (id){
         return await this.model.findById(id).populate('profile').exec()
      }else {
         return await this.model.find().populate('profile').exec()
      }
   }

   async getBlocked(id?: string, msg?: string): Promise<any>{
      if (id && msg)
         return await this.model.findByIdAndUpdate(id, {status: 'Blocked', message: msg}).exec();
      else if (id && !msg)
         return await this.model.findByIdAndUpdate(id, {status: 'Blocked'}).exec();
      else
      {
         const data = await this.model.find({status: 'Blocked'}).exec()
         if (data){
            for (let i = 0; i < data.length; ++i) {
               data[i].profile = <IPerson>await this.personService.fetch(data[i].profile.toString());
               if (data[i].profile != null){
                  // @ts-ignore
                  data[i].profile.username = "";
                  // @ts-ignore
                  data[i].profile.password = "";
               }
            }
         }
         return data;
      }
   }

   async getUnblocked(id: string): Promise<any>{
      return await this.model.findByIdAndUpdate(id, {status: 'Active'}).exec();
   }

   async searchActive(query: any){

      let results = []

      const persons = await this.personService.search(query);
      const activeCustomers = await this.model.find({status: 'Active'}).populate('profile').exec()
      console.log(activeCustomers)
      if (activeCustomers){
         for (const item of persons){
            for (const index of activeCustomers){

               // @ts-ignore
               if (item._id == index.profile.id){
                  results.push(index)
               }
            }
         }
      }
      console.log(results)
      return results
   }

   async searchBlocked(query: any){
      const persons = await this.personService.search(query);
      const activeCustomers = await this.model.find({status: 'Blocked'}).populate('profile').exec()
      let results = []

      if (activeCustomers){
         for (const item of persons){
            for (const index of activeCustomers){
               // @ts-ignore
               if (item._id == index.profile.id){
                  results.push(index)
               }
            }
         }
      }
      return results
   }

}
