import {Document} from "mongoose";

export interface IRejectedDrivers extends Document{
   request : string,
   message : string,
   createdAt : Date
}