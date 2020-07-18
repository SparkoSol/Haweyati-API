import { Injectable } from '@nestjs/common';
import { SimpleService } from "../../common/lib/simple.service";
import { IDriversInterface } from "../../data/interfaces/drivers.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IDriverRequest } from '../../data/interfaces/driverRequest.interface';
// import { Client } from '@googlemaps/google-maps-services-js/dist';
import { IRejectedDrivers } from "../../data/interfaces/rejectedDrivers.interface";

@Injectable()
export class DriversService extends SimpleService<IDriversInterface>{
   constructor(
      @InjectModel('drivers') protected readonly model: Model<IDriversInterface>,
      @InjectModel('driverRequest') protected readonly requestModel: Model<IDriverRequest>,
      @InjectModel('driverRejection') protected readonly rejectedModel: Model<IRejectedDrivers>
   )
   {
      super(model);
   }

   fetch(id?: string): Promise<IDriversInterface[] | IDriversInterface> {
      if (id) return this.model.find({_id: id, supplier: null}).populate('profile').exec()
      return this.model.find({supplier: null}).populate('profile').exec()
   }

   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
   async create(document: any): Promise<IDriversInterface> {
      document._id = undefined;
      const data = await this.model.create(document);
      await this.requestModel.create({
         driver: data._id,
         status: data.status
      });
      return data;
   }

   // async getLocationData(lat: any, lng: any): Promise<any> {
   //    const client = new Client({});
   //
   //    let location = null;
   //    try {
   //       location = await client.reverseGeocode({
   //          params: {
   //             latlng: [lat, lng],
   //             key: process.env.GOOGLE_MAPS_API_KEY,
   //          },
   //          timeout: 1000, // milliseconds
   //       })
   //    } catch (e) {
   //       console.log(e.response)
   //    }
   //    const n = location?.data?.results[0]?.address_components.length
   //    return location?.data?.results[0]?.address_components[n-3]?.long_name
   // }

   async getRequests(): Promise<IDriverRequest[]> {
      // eslint-disable-next-line prefer-const
      let requests = await this.requestModel.find({status: 'Pending'}).exec();
      // eslint-disable-next-line prefer-const
      let result = []
      for (let i = 0 ; i< requests.length; i++) {
         const data = await this.fetch(requests[i].driver.toString()) as IDriversInterface

         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         // @ts-ignore
         if (data && data.length > 0) {
            const { driver, ...others } = requests[i]

            result.push({
               // eslint-disable-next-line @typescript-eslint/ban-ts-comment
               // @ts-ignore
               ...others._doc,
               driver: data[0]
            })
         }
      }

      return result;
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
         return await this.model.find({status: 'Approved', supplier : null}).populate('profile').exec()
      }
   }

   async getRejected(id?: string, data?: any): Promise<any>{
      if(id) {
         const request = await this.requestModel.findById(id).exec();
         if (data != null){
            this.rejectedModel.create({
               request : id,
               message : data.message,
               createdAt: Date.now()
            });
         }
         await this.model.findByIdAndUpdate(request.driver._id ,{status: 'Rejected'}).exec();
         await this.requestModel.findByIdAndUpdate(id, {status: 'Rejected'})
         return {
            message : "Request Rejected"
         }
      }
      else {
         return await this.model.find({status: 'Rejected', supplier : null}).populate('profile').exec()
      }
   }

   async getBlocked(id?: string): Promise<any> {
      if (id){
         return await this.model.findByIdAndUpdate(id, {status : 'Blocked'}).exec();
      }
      else {
         return await this.model.find({status: 'Blocked', supplier : null}).populate('profile').exec()
      }
   }

   async getUnblocked(id: string): Promise<any>{
      return await this.model.findByIdAndUpdate(id, {status : 'Approved'}).exec()
   }

   async getCompanyDrivers(id: string): Promise<IDriversInterface[]>{
      return await this.model.find().where('supplier',id).populate('profile').exec()
   }

}