import { HttpService, Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IShopRegistrationInterface} from "../../data/interfaces/shopRegistration.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
// import {Client} from "@googlemaps/google-maps-services-js";
// import { computeDistanceBetween, LatLng } from 'spherical-geometry-js';
import {ReportUtils} from "../../common/lib/report-utils";
import { PersonsService } from "../persons/persons.service";

@Injectable()
export class ShopRegistrationService extends SimpleService<IShopRegistrationInterface>{
   constructor(
      @InjectModel('shopregistration')
      protected readonly model:Model<IShopRegistrationInterface>,
      protected readonly personService : PersonsService,
      private httpService: HttpService
   ) {
      super(model);
   }

   async fetch(id?: string): Promise<IShopRegistrationInterface[] | IShopRegistrationInterface> {
      if (id) return await this.model.findById(id).where('status','Active').populate('person').exec()
      else {
         return await this.model.find({parent: null, status: 'Active'}).populate('person').exec()
      }
   }

   async addProfile(data: any): Promise<any>{
      const profile = await this.personService.fetchFromContact(data.contact);
      if (profile){
         if (profile.scope.includes('supplier'))
            return null;
         else
         {
            profile.scope.push('supplier')
            await this.personService.change(profile)
         }
      }
      else
      {
         data.scope = 'supplier';
         // data.scope.push(data.scope)
         return await this.personService.create(data);
      }
   }

   async fetchAll(): Promise<any> {
         return await this.model.find({status: 'Active'}).exec()
   }

   async getDataFromCityName (city: string, service: string): Promise<any>{
      const data = await this.model.find({city: city, status: 'Active'}).exec()
      const newSet = new Set()
      data.forEach(value => {
         if(value.services.includes(service)){
            newSet.add(value._id)
         }
      })
      return Array.from(newSet)
   }

   async getByService(name: string): Promise<any>{
      const data = await this.model.find({status: 'Active'}).exec()
      const newSet = new Set()
      data.forEach(value => {
         if(value.services.includes(name)){
            newSet.add(value)
         }
      })
      return Array.from(newSet)
   }

   async getSubsuppliers(id: string): Promise<any>{
      return this.model.find({parent: id, status: 'Active'}).exec()
   }

   async getPendingSuppliers(): Promise<any>{
      return this.model.find({status: 'Pending'}).exec()
   }

   async getApproved(id: string): Promise<any>{
      return await this.model.findByIdAndUpdate(id, {status: 'Active'}).exec()
   }

   async getRejected(id?: string): Promise<IShopRegistrationInterface | IShopRegistrationInterface[]>{
      if (id){
         return await this.model.findByIdAndUpdate(id, {status: 'Rejected'}).exec()
      }
      else {
         return await this.model.find({status: 'Rejected'})
      }
   }

   async getDataFromCity(city: string): Promise<any>{
      const data = await this.model.find({status: 'Active'}).where('city', city).exec();
      const newSet = new Set<string>();

      for (const item of data){
         for (let i = 0; i<item.services.length; i++){
            newSet.add(item.services[i])
         }
      }
      return {
         services : Array.from(newSet),
         city : city
      };
   }

   // getDistance(p1lat: any, p1lng: any, p2lat: any, p2lng: any){
   //    try {
   //       const p1latlng = new LatLng(p1lat, p1lng)
   //       const p2latlng = new LatLng(p2lat, p2lng)
   //       console.log(((computeDistanceBetween(p1latlng, p2latlng))/1000).toFixed(2) + 'KM')
   //    }
   //    catch (e) {
   //       console.log("Can't find distance")
   //    }
   // }
   // async getLocationData(lat: any, lng: any): Promise<any> {
   //    const client = new Client({});
   //
   //    let location = null;
   //    try {
   //       location = await client.reverseGeocode({
   //          params: {
   //             latlng: [lat, lng],
   //             // key: process.env.GOOGLE_MAPS_API_KEY,
   //             key: 'AIzaSyDSz2Q7d49FVjGoAW2k8eWFXSdQbbipVc8',
   //          },
   //          timeout: 1000, // milliseconds
   //       })
   //    } catch (e) {
   //       console.log(e.response)
   //       console.log(e.response.data.error_message);
   //    }
   //    const n = location?.data?.results[0]?.address_components.length
   //    return location?.data?.results[0]?.address_components[n-3]?.long_name
   // }

   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
   async generateReport() {
      return ReportUtils.renderReport('SupplierReport.odt', await this.fetch())
   }

}