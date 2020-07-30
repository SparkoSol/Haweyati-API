import { Schema } from 'mongoose'

export const ScaffoldingsSchema = new Schema(
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
    pricing: [
      {
        city: String,
        rent: Number,
        days: Number,
        extraDayRent: Number
      }
    ]
  },
  { timestamps: true }
)
