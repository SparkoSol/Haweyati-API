import { Document } from 'mongoose'
import { IImage } from "./image.interface"
import { IShopRegistration } from './shop-registration.interface'

export interface IScaffoldingInterface extends Document {
  suppliers: IShopRegistration[]
  description: string
  type: string
  image: IImage
  pricing: [
    {
      city: string

      mesh: {
        half: number
        full: number
      }
      wheels: number
      connections: number

      rent: number
      days: number
      extraDayRent: number
    }
  ],
  volumetricWeight: number
}
