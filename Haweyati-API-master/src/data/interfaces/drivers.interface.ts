import { Document } from 'mongoose';
import {IPerson} from './person.interface';
import { IVehicles } from './vehicles.interface';
import { IShopRegistrationInterface } from './shopRegistration.interface';
import { ILocation } from './location.interface';

export interface IDriversInterface extends Document{
   profile: IPerson,
   supplier: IShopRegistrationInterface
   license: string,
   city: string,
   vehicle : IVehicles,
   status: string,
   location: ILocation
}