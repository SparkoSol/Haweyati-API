import { Document as d } from "mongoose";
import { IShopRegistrationInterface as shop} from "./shop-registration.interface";
import { IImage } from './image.interface'

export interface IServicesRequests extends d {
   suppliers : shop | string
   description: string
   data : any
   type : string
   status : string
   note : string
   requestNo : string
   image: IImage
}
