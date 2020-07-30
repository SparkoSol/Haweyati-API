import { Schema } from 'mongoose'

export const RejectedDriversSchema = new Schema(
  {
    request: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      required: false,
      default: Date.now()
    }
  },
  { timestamps: true }
)
