import { Document } from 'mongoose'
import { IShopRegistration } from './shop-registration.interface'
import { IImage } from './image.interface'
import { IFinishingMaterialCategory } from './finishingMaterialCategory.interface'

export interface IFinishingMaterials extends Document {
  name: string
  description: string
  parent: IFinishingMaterialCategory | string
  suppliers: IShopRegistration[]
  image: IImage
  price: number
  options: [
    {
      optionName: string
      optionValues: string
    }
  ]
  varient: [object]
  status: string
}
