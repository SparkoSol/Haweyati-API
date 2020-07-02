import {Document} from "mongoose";
import { IShopRegistrationInterface } from './shopRegistration.interface';
import { IImage } from './image.interface';

export interface IScaffoldingsInterface extends Document{
  size: string,
  suppliers : IShopRegistrationInterface[],
  images: IImage[],
  description: string,
  pricing: [
    {city:string},
    {rent: number},
    {days: number},
    {extraDayRent: number}
  ]
}