import { Schema } from 'mongoose'
import { ImagesSchema } from "./images.schema";

export const ScaffoldingSchema = new Schema(
  {
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
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
    pricing: [
      new Schema(
        {
          city: String,

          mesh: new Schema(
            {
              half: Number,
              full: Number,
            },
            { _id: false }
          ),
          wheels: Number,
          connections: Number,

          rent: Number,
          days: Number,
          extraDayRent: Number
        },
        { _id: false }
      )
    ],
    volumetricWeight: {
      type: Number,
      required: true
    },
  },
  { timestamps: true }
)
