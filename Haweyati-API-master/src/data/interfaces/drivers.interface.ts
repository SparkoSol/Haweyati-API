import { Document } from 'mongoose'
import { IPerson } from './person.interface'
import { IVehicle } from './vehicles.interface'
import { IShopRegistration } from './shop-registration.interface'

export interface IDriver extends Document {
  profile: IPerson | string
  supplier: IShopRegistration
  license: string
  city: string
  vehicle: IVehicle
  status: string
  rating: number
  deviceId: string
}
