import {Document} from 'mongoose';
import { IImage } from './image.interface';

export interface IBuildingMaterialCategory extends Document{
  name: string,
  description: string,
  images: IImage[]
}