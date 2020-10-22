import {Document} from "mongoose";
import { IShopRegistration } from './shop-registration.interface';

export interface IScaffoldingsInterface extends Document{
   suppliers : IShopRegistration[],
   description: string,
   type: string,
   pricing: [
      {city:string},
      {rent: number},
      {days: number},
      {extraDayRent: number}
   ]
}
