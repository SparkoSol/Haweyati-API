import {Document} from "mongoose";
import { IShopRegistrationInterface } from './shopRegistration.interface';
import { IImage } from './image.interface';
import { IFinishingMaterialVarients } from './finishingMaterialVarients.interafce';

export interface IFinishingMaterialsInterface extends Document{
  name: string,
  description: string,
  parent: IFinishingMaterialsInterface,
  suppliers : IShopRegistrationInterface[],
  images: IImage[],
  varients : IFinishingMaterialVarients[]
}