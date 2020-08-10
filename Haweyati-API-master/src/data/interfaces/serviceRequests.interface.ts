import { Document as d } from "mongoose";
import { IShopRegistrationInterface as shop} from "./shop-registration.interface";

export interface IServicesRequests extends d {
   suppliers : shop | string
   data : any
   type : string
   status : string
   note : string
   requestNo : string
}