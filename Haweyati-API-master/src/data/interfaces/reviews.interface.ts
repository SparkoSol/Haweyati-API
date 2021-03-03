import { Document } from "mongoose";
import { IOrders } from "./orders.interface";
import { IDriversInterface } from "./drivers.interface";
import { ICustomerInterface } from "./customers.interface";
import { IShopRegistration } from "./shop-registration.interface";

export interface IReviews extends Document{
  customer: ICustomerInterface | string
  supplier: IShopRegistration | string
  driver: IDriversInterface | string
  order: IOrders | string
  supplierFeedback: string
  driverFeedback: string
  supplierRating: number
  driverRating: number
}