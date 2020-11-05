import {ILocation} from "./location.interface";
import { IPerson } from "./person.interface";
import {Document} from "mongoose";

export interface IShopRegistration extends Document{
   person : IPerson | string
   location: ILocation
   address: string
   parent: string
   city: string,
   services : [string]
   rating: number
   status: string,
   message: string
}
