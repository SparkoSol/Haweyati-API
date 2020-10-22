import { Document } from 'mongoose'
import { IBuildingMaterials } from './buildingMaterials.interface'

export interface IBuildingMaterialRewardPoints extends Document{
  material: IBuildingMaterials | string
  points: number
}