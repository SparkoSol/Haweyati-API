import { Document } from 'mongoose'
import { IImage } from './image.interface'
import { IBuildingMaterialCategory } from './buildingMaterialCategory.interface'

export interface IBuildingMaterialSubCategory extends Document {
  name: string
  description: string
  image: IImage
  parent: IBuildingMaterialCategory | string
  status: string
}
