import { IVehicleType } from './vehicleType.interface'

export interface IVehicles {
   name: string,
   model: string,
   identificationNo : string,
   type: IVehicleType | string
}