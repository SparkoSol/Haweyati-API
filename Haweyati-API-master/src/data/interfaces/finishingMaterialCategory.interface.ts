import {Document} from 'mongoose';
import { IImage } from './image.interface';

export interface IFinishingMaterialCategory extends Document{
  name: string,
  description: string,
  images: IImage,
  status : string
}