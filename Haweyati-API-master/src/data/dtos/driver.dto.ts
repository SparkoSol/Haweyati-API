import { IImage } from "../interfaces/image.interface";
import { IPerson } from "../interfaces/person.interface";
import { IVehicle } from "../interfaces/vehicles.interface";
import { IVehicleType } from "../interfaces/vehicleType.interface";
import { IShopRegistration } from "../interfaces/shop-registration.interface";

export interface dtoDriver {
  _id: string
  profile: IPerson | string
  supplier: IShopRegistration
  license: string
  city: string
  vehicle: IVehicle
  status: string
  rating: number
  deviceId: string

  name: string
  contact: string
  email: string
  image: IImage
  password: string
  scope: string
  token: string

  model: string,
  identificationNo : string,
  type: IVehicleType | string
  vehicleName: string
  isVehicleInfoChanged: any
  isAdmin: boolean

  location: any
  latitude: number,
  longitude: number,
  address : string
}