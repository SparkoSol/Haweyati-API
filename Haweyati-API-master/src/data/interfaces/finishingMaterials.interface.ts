import {Document} from "mongoose";
import { IShopRegistrationInterface } from './shopRegistration.interface';
import { IImage } from './image.interface';

export interface IFinishingMaterialsInterface extends Document{
  name: string,
  description: string,
  parent: IFinishingMaterialsInterface,
  suppliers : IShopRegistrationInterface[],
  images: IImage[],
  pricing: [
    {city:string},
    {price: number},
    {days: number}
  ]
}