import {Document} from "mongoose";
import { IShopRegistrationInterface } from './shop-registration.interface';

export interface IScaffoldingsInterface extends Document{
   suppliers : IShopRegistrationInterface[],
   description: string,
   type: string,
   pricing: [
      {city:string},
      {rent: number},
      {days: number},
      {extraDayRent: number}
   ]
}
