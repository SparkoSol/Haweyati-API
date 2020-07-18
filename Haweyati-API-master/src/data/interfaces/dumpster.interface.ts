import { Document } from 'mongoose';
import { IImage } from './image.interface';
import { IShopRegistrationInterface } from './shopRegistration.interface';

export interface IDumpster extends Document {
  size: string,
  suppliers : IShopRegistrationInterface[],
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