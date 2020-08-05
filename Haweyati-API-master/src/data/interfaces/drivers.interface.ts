import { Document } from 'mongoose'
import { IPerson } from './person.interface'
import { IVehicles } from './vehicles.interface'
import { IShopRegistrationInterface } from './shop-registration.interface'
import { ILocation } from './location.interface'

export interface IDriversInterface extends Document {
  profile: IPerson | string
  supplier: IShopRegistrationInterface
  license: string
  city: string
  vehicle: IVehicles
  status: string
}
