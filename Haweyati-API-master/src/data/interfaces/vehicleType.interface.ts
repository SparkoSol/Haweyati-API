import { Document } from 'mongoose'
import { IImage } from './image.interface'

export interface IVehicleType extends Document{
  name: string,
  image: IImage,
  volumetricWeight: number
  deliveryCharges: number
  cbmLength: number
  cbmWidth: number
  cbmHeight: number
}