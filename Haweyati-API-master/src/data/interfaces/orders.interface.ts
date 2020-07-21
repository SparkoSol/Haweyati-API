import { Document } from "mongoose";
import { ILocation } from "./location.interface";
import { IImage } from "./image.interface";
import { ICustomerInterface } from "./customers.interface";

export interface IOrdersInterface  extends Document{
  service: string,
  itemId: string,
  dropoffLocation: ILocation,
  dropoffAddress : string,
  dropoffDate: Date,
  dropoffTime: string,
  image : IImage,
  details: any,
  customer: ICustomerInterface | string,
  status: string
}