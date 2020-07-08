import {Document} from "mongoose";
import { IPerson } from './person.interface';
import { ILocation } from './location.interface';

export interface ICustomerInterface extends Document{
   profile: IPerson,
   location: ILocation,
   status: string
}