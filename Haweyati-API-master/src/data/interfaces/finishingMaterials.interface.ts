import { Document } from 'mongoose'
import { IShopRegistration } from './shop-registration.interface'
import { IImage } from './image.interface'
import { IFinishingMaterialCategory } from './finishingMaterialCategory.interface'

export interface IFinishingMaterial extends Document {
  name: string
  description: string
  parent: IFinishingMaterialCategory | string
  suppliers: IShopRegistration[] | string[]
  image: IImage
  price: number
  volumetricWeight: number
  cbmLength: number
  cbmWidth: number
  cbmHeight: number
  options: [
    {
      optionName: string
      optionValues: string
    }
  ]
  varient: [object]
  status: string
}
