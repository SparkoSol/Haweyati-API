import { Document as d } from "mongoose";
import { IShopRegistration as shop} from "./shop-registration.interface";
import { IImage } from './image.interface'

export interface IServiceRequest extends d {
   suppliers : shop | string
   description: string
   data : any
   type : string
   status : string
   note : string
   requestNo : string
   image: IImage
}
