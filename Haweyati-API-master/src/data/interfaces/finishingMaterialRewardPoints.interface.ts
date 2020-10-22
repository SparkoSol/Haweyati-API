import { Document } from 'mongoose'
import { IFinishingMaterials } from './finishingMaterials.interface'

export interface IFinishingMaterialRewardPoints extends Document{
  material: IFinishingMaterials | string
  points: number
}