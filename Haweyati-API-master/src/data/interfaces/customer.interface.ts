import {Document} from "mongoose";
import { IPerson } from './person.interface';
import { ILocation } from './location.interface';

export interface ICustomer extends Document{
   profile: IPerson | string,
   location: ILocation,
   status: string,
   points: number
   rating: number
   referralCode: string
   fromReferralCode: string
   message : string
}