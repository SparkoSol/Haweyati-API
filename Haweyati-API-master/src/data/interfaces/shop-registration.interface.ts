import {ILocation} from "./location.interface";
import { IPerson } from "./person.interface";
import {Document} from "mongoose";

export interface IShopRegistrationInterface extends Document{
   person : IPerson | string
   location: ILocation
   address: string
   parent: string
   city: string,
   services : [string]
   status: string,
   message: string
}
