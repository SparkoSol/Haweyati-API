import { Document } from "mongoose";
import { IOrder } from "./orders.interface";
import { IDriver } from "./drivers.interface";
import { ICustomer } from "./customer.interface";
import { IShopRegistration } from "./shop-registration.interface";

export interface IReview extends Document{
  customer: ICustomer | string
  supplier: IShopRegistration | string
  driver: IDriver | string
  order: IOrder | string
  supplierFeedback: string
  driverFeedback: string
  supplierRating: number
  driverRating: number
}