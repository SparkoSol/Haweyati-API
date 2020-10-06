import { Document } from 'mongoose'
import { IShopRegistrationInterface } from './shop-registration.interface'
import { IImage } from './image.interface'
import { IFinishingMaterialCategory } from './finishingMaterialCategory.interface'

export interface IFinishingMaterialsInterface extends Document {
  name: string
  description: string
  parent: IFinishingMaterialCategory | string
  suppliers: IShopRegistrationInterface[]
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
