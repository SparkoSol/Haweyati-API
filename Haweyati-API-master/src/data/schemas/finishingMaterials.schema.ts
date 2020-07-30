import { Schema } from 'mongoose'
import { ImagesSchema } from './images.schema'

export const FinishingMaterialsSchema = new Schema(
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
      ref: 'finishingmaterialcategory',
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
      required: false
    },
    price: {
      type: Number,
      required: false
    },
    options: [
      {
        optionName: String,
        optionValues: String
      }
    ],
    varient: [Object],
    status: {
      type: String,
      required: false,
      default: 'Active'
    }
  },
  { timestamps: true }
)
