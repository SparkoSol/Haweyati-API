import { Document } from 'mongoose';
import { IImage } from './image.interface';

export interface IDumpster extends Document {
  size: string,
  images: IImage[],
  description: string,
  pricing: [
      {city:string},
      {rent: number},
      {days: number},
      {extraDayRent: number}
  ]
}