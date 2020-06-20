import { Document, Schema } from 'mongoose';
import { ILocation } from './location.interface';

export interface IShopRegistrationInterface extends Document{
  name: string,
  location: ILocation,
  email:string,
  contact: string,
  city: string,
  parent: string,
  services : string[]
}