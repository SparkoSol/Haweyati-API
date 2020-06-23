import { HttpService, Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IShopRegistrationInterface} from "../../data/interfaces/shopRegistration.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { computeDistanceBetween, LatLng } from 'spherical-geometry-js';
import { Observable } from 'rxjs';
import axios, { AxiosResponse} from 'axios';



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

    getCity(lon: string, lat: string): Promise<AxiosResponse>{
        console.log(lon, lat)
        return axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon+'&key=AIzaSyDSz2Q7d49FVjGoAW2k8eWFXSdQbbipVc8')
        // return this.fetchCity(lon, lat)
    }

    private fetchCity(lon: string, lat: string): Promise<AxiosResponse> {
        const latlng = new LatLng(lat, lon);
        return new Promise(((resolve, reject) => {
            try {
                this.httpService.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon+'&key=AIzaSyDSz2Q7d49FVjGoAW2k8eWFXSdQbbipVc8', {

                })
                  .subscribe(data => resolve(data))
            } catch (e) {
                reject(e)
            }
        }));


        // const p1latlng = new LatLng(p1lat, p1lng);
        // const p2latlng = new LatLng(p2lat, p2lng);
        // console.log(computeDistanceBetween(p1latlng, p2latlng));

    }
}