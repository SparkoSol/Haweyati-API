import { Document } from 'mongoose'
import { IPerson } from './person.interface'
import { IVehicles } from './vehicles.interface'
import { IShopRegistration } from './shop-registration.interface'

export interface IDriversInterface extends Document {
  profile: IPerson | string
  supplier: IShopRegistration
  license: string
  city: string
  vehicle: IVehicles
  status: string
  rating: number
  deviceId: string
}
