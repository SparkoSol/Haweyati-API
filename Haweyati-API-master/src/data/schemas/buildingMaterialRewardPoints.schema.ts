import { Schema } from 'mongoose'

export const BuildingMaterialRewardPointsSchema = new Schema({
  material: {
    type: Schema.Types.ObjectId,
    ref: 'buildingmaterials',
    required: true
  },
  points: {
    type: Number,
    required: true
  }
})