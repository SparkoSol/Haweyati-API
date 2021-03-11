import { IVehicleType } from './vehicleType.interface'

export interface IVehicle {
   name: string,
   model: string,
   identificationNo : string,
   type: IVehicleType | string
}