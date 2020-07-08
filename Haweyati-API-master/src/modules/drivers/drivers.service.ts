import { Injectable } from '@nestjs/common';
import { SimpleService } from "../../common/lib/simple.service";
import { IDriversInterface } from "../../data/interfaces/drivers.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IDriverRequest } from '../../data/interfaces/driverRequest.interface';
import { Client } from '@googlemaps/google-maps-services-js/dist';
import { PersonsService } from '../persons/persons.service';
import { IPerson } from '../../data/interfaces/person.interface';

@Injectable()
export class DriversService extends SimpleService<IDriversInterface>{
   constructor(
      @InjectModel('drivers') protected readonly model: Model<IDriversInterface>,
      @InjectModel('driverRequest') protected readonly requestModel: Model<IDriverRequest>,
      protected readonly personService : PersonsService
   )
   {
      super(model);
   }

   fetch(id?: string): Promise<IDriversInterface[] | IDriversInterface> {
      if (id) return this.model.findById(id).populate('profile').exec()
      return this.model.find().populate('profile').exec()
   }

   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
   async create(document: any): Promise<IDriversInterface> {
      document.city = await this.getLocationData(document.location.latitude, document.location.longitude);
      const data = await super.create(document);
      this.requestModel.create({
         driver: data._id,
         status: data.status
      });
      return data;
   }

   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
   async getLocationData(lat: any, lng: any): Promise<any> {
      const client = new Client({});

      let location = null;
      try {
         location = await client.reverseGeocode({
            params: {
               latlng: [lat, lng],
               key: process.env.GOOGLE_MAPS_API_KEY,
            },
            timeout: 1000, // milliseconds
         })
      } catch (e) {
         console.log(e.response)
      }
      const n = location?.data?.results[0]?.address_components.length
      return location?.data?.results[0]?.address_components[n-3]?.long_name
   }

   async getRequests(): Promise<IDriverRequest[]> {
      const requests = await this.requestModel.find().exec();

      for (const req of requests) {
         req.driver = await this.fetch(req.driver.toString()) as IDriversInterface
      }

      return requests;
   }

   async getVerified(id?: string): Promise<any> {
      if (id){
         const request = await this.requestModel.findById(id).exec();
         await this.model.findByIdAndUpdate(request.driver._id ,{status: 'Approved'}).exec();
         await this.requestModel.findByIdAndDelete(id);
         return {
            message : "Request Approved"
         }
      }
      else{
         return await this.model.find({status: 'Approved'}).populate('profile').exec()
      }
   }

   async getRejected(id?: string): Promise<any>{
      if(id) {
         const request = await this.requestModel.findById(id).exec();
         await this.model.findByIdAndUpdate(request.driver._id ,{status: 'Rejected'}).exec();
         await this.requestModel.findByIdAndDelete(id);
         return {
            message : "Request Rejected"
         }
      }
      else {
         return await this.model.find({status: 'Rejected'}).populate('profile').exec()
      }
   }

   async getBlocked(id?: string): Promise<any> {
      if (id){
         return await this.model.findByIdAndUpdate(id, {status : 'Blocked'}).exec();
      }
      else {
         return await this.model.find({status: 'Blocked'}).populate('profile').exec()
      }
   }

   async getUnblocked(id: string): Promise<any>{
      return await this.model.findByIdAndUpdate(id, {status : 'Approved'}).exec()
   }

   async getCompanyDrivers(id: string): Promise<IDriversInterface[]>{
      return await this.model.find().where('supplier',id).populate('profile').exec()
   }

}