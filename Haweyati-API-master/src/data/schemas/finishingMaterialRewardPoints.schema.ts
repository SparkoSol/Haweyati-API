import { Schema } from 'mongoose'

export const FinishingMaterialRewardPointsSchema = new Schema({
  material: {
    type: Schema.Types.ObjectId,
    ref: 'finishingmaterials',
    required: true
  },
  points: {
    type: Number,
    required: true
  }
})