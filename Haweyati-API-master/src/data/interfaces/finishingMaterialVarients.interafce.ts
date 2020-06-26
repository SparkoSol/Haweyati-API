import {Document} from 'mongoose';

export interface IFinishingMaterialVarients extends Document{
   varientNames : [string],
   price: number
}