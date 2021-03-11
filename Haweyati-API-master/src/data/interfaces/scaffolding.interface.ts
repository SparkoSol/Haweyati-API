import { Document } from 'mongoose'
import { IImage } from "./image.interface"
import { IShopRegistration } from './shop-registration.interface'

export interface IScaffolding extends Document {
  suppliers: IShopRegistration[] | string[]
  description: string
  name: string
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
  cbmLength: number
  cbmWidth: number
  cbmHeight: number
}
