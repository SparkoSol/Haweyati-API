import { Document } from 'mongoose'
import { IShopRegistration } from './shop-registration.interface'
import { IImage } from './image.interface'
import { IBuildingMaterialCategory } from './buildingMaterialCategory.interface'

export interface IBuildingMaterials extends Document {
  name: string
  description: string
  parent: IBuildingMaterialCategory
  suppliers: IShopRegistration[]
  image: IImage
  price12yard: number[]
  price20yard: number[]
  pricing: [
    {
      city: string
      price12yard: number
      price20yard: number
    }
  ]
  status: string
}
