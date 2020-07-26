import { Document } from 'mongoose'
import { IShopRegistrationInterface } from './shop-registration.interface'
import { IImage } from './image.interface'
import { IBuildingMaterialCategory } from './buildingMaterialCategory.interface'

export interface IBuildingMaterialsInterface extends Document {
  name: string
  description: string
  parent: IBuildingMaterialCategory
  suppliers: IShopRegistrationInterface[]
  image: IImage
  pricing: [{ city: string }, { price: number }]
  status: string
}
