import {Document} from "mongoose";
import { IShopRegistrationInterface } from './shopRegistration.interface';
import { IImage } from './image.interface';

export interface IBuildingMaterialsInterface extends Document{
  name: string,
  description: string,
  parent: IBuildingMaterialsInterface,
  suppliers : IShopRegistrationInterface[],
  images: IImage[],
  pricing: [
    {city:string},
    {price: number}
  ]
}