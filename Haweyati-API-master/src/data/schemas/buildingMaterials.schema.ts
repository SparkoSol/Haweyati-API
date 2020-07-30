import { Schema } from 'mongoose'
import { ImagesSchema } from './images.schema'

export const BuildingMaterialsSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'buildingmaterialcategory',
      required: false
    },
    suppliers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'shopregistration',
        required: false
      }
    ],
    image: {
      type: ImagesSchema,
      required: true
    },
    price12yard: {
      type: Number,
      required: true
    },
    price20yard: {
      type: Number,
      required: true
    },
    pricing: [
      {
        city: String,
        price12yard: Number,
        price20yard: Number
      }
    ],
    status: {
      type: String,
      required: false,
      default: 'Active'
    }
  },
  { timestamps: true }
)
