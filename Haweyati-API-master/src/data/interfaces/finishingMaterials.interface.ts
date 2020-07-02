import {Document} from "mongoose";
import { IShopRegistrationInterface } from './shopRegistration.interface';
import { IImage } from './image.interface';
import { IFinishingMaterialCategory } from './finishingMaterialCategory.interface';

export interface IFinishingMaterialsInterface extends Document{
  name: string,
  description: string,
  parent: IFinishingMaterialCategory,
  suppliers : IShopRegistrationInterface[],
  images: IImage[],
  price: number,
  options: [{
    optionName: string,
    optionValues: string
  }],
  varient : [object]
}