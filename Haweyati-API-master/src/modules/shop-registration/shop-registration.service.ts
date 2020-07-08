import { HttpService, Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IShopRegistrationInterface} from "../../data/interfaces/shopRegistration.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Client} from "@googlemaps/google-maps-services-js";
import { computeDistanceBetween, LatLng } from 'spherical-geometry-js';

@Injectable()
export class ShopRegistrationService extends SimpleService<IShopRegistrationInterface>{
   constructor(
      @InjectModel('shopregistration')
      protected readonly model:Model<IShopRegistrationInterface>,
      private httpService: HttpService
   ) {
      super(model);
   }
   async getDataFromCityName (city: string, service: string): Promise<any>{
      const data = await this.model.find({city: city}).exec()
      const newSet = new Set()
      data.forEach(value => {
         if(value.services.includes(service)){
            newSet.add(value._id)
         }
      })
      return Array.from(newSet)
   }

   async getSubsuppliers(id: string): Promise<any>{
      return this.model.find({parent: id}).exec()
   }

   async getDataFromCoordinates(lat: string, lng: string): Promise<any>{
      const cityName = await this.getLocationData(lat, lng);

      const data = await this.model.find().where('city', cityName).exec();
      const newSet = new Set<string>();

      for (const item of data)
         item.services.forEach(service => {
            if (service) newSet.add(service)
         })
      return {
         services : Array.from(newSet),
         city : cityName
      };
   }

   getDistance(p1lat: any, p1lng: any, p2lat: any, p2lng: any){
      try {
         const p1latlng = new LatLng(p1lat, p1lng)
         const p2latlng = new LatLng(p2lat, p2lng)
         console.log(((computeDistanceBetween(p1latlng, p2latlng))/1000).toFixed(2) + 'KM')
      }
      catch (e) {
         console.log("Can't find distance")
      }
   }

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
         console.log(e.response.data.error_message);
      }
      const n = location?.data?.results[0]?.address_components.length
      return location?.data?.results[0]?.address_components[n-3]?.long_name
   }
}