import { ILocation } from './location.interface';
import { Document } from 'mongoose';
import { IImage } from './image.interface';

export interface ISupplier extends Document {
  image: IImage,
  name: string,
  email: string,
  contact: string,
  address: string,
  location: ILocation,
  parentId: string,
  services: [string]
}