import {Document} from "mongoose";
import { IShopRegistrationInterface } from './shopRegistration.interface';

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