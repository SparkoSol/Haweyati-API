import { Document } from 'mongoose';
import { ILocation } from './location.interface';
import { IImage } from './image.interface';

export interface IShopRegistrationInterface extends Document {
  name: string,
  location: ILocation,
  email:string,
  contact: string,
  address: string,
  parent: string,
  city: string,
  services : string[]
  images : IImage[]
}