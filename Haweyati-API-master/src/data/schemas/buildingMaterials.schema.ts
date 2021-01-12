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
      ref: 'buildingmaterialsubcategories',
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
    pricing: [
      new Schema(
        {
          city: String,
          price: [
            new Schema(
              {
                price: Number,
                unit: String
              },
              { _id: false }
            )
          ]
        },
        { _id: false }
      )
    ],
    volumetricWeight: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: false,
      default: 'Active'
    }
  },
  { timestamps: true }
)
