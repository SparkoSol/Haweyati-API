import { Document } from 'mongoose';
import { IImage } from './image.interface';
import { IShopRegistration } from './shop-registration.interface';

export interface IDumpster extends Document {
  name: string,
  suppliers : IShopRegistration[] | string[],
  image: IImage,
  description: string,
  pricing: [
      {city:string},
      {rent: number},
      {days: number},
      {extraDayRent: number},
      {helperPrice: number}
  ],
  status: string
}