import { Document } from 'mongoose'
import { IImage } from './image.interface'

export interface IVehicleType extends Document{
  name: string,
  image: IImage,
  maxWeight: number,
  maxVolume: number,
  minWeight: number,
  minVolume: number
}