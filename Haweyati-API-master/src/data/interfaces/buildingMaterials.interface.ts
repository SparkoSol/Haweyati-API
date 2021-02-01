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
  pricing: [
    {
      city: string,
      price: [
        {
          price: number,
          unit: string
        }
      ]
    }
  ],
  // volumetricWeight: number
  // cbmLength: number
  // cbmWidth: number
  // cbmHeight: number
  status: string
}
