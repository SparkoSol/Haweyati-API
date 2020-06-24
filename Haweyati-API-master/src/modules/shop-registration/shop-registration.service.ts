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
    async getDataFromCity(cityName: string): Promise<string[]>{
        const data = await this.model.find().where('city', cityName).exec();
        const newSet = new Set<string>();

        for (const item of data)
            item.services.forEach(service => {
                if (service) newSet.add(service)
            })
        return Array.from(newSet);
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
    getLocationData(lat: any, lng: any){
        const client = new Client({});
        client
          .reverseGeocode({
              params: {
                  latlng: [lat, lng],
                  key: "AIzaSyDSz2Q7d49FVjGoAW2k8eWFXSdQbbipVc8",
              },
              timeout: 1000, // milliseconds
          })
          .then((r) => {
              console.log(r.data.results[0].address_components[6].long_name);
          })
          .catch((e) => {
              console.log(e.response)
              console.log(e.response.data.error_message);
          });
    }
}