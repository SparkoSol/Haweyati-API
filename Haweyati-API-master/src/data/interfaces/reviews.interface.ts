import { Document } from "mongoose";
import { ICustomerInterface } from "./customers.interface";
import { IShopRegistration } from "./shop-registration.interface";
import { IDriversInterface } from "./drivers.interface";

export interface IReviews extends Document{
  customer: ICustomerInterface | string
  supplier: IShopRegistration | string
  driver: IDriversInterface | string
  supplierFeedback: string
  driverFeedback: string
}