import { Document } from 'mongoose'
import { IImage } from './image.interface'
import { IShopRegistration } from './shop-registration.interface'
import { IBuildingMaterialSubCategory } from './buildingMaterialSubCategory.interface'

export interface IBuildingMaterials extends Document {
  name: string
  description: string
  parent: IBuildingMaterialSubCategory
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
