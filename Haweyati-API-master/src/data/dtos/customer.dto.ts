import {Document} from "mongoose";
import { IImage } from "../interfaces/image.interface";
import { IPerson } from "../interfaces/person.interface";
import { ILocation } from "../interfaces/location.interface";

export interface dtoCustomer extends Document{
  profile: IPerson | string,
  location: ILocation,
  status: string,
  points: number
  rating: number
  referralCode: string
  fromReferralCode: string
  message : string

  personId: string

  name: string
  contact: string
  username: string
  email: string
  image: IImage
  password: string
  scope: string
  token: string

  longitude: number
  latitude: number
  address: string
}

export interface dtoCustomerQuery{ name: string }
