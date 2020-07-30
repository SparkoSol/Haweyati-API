import { Schema } from 'mongoose'

export const FcmSchema = new Schema(
  {
    person: {
      type: Schema.Types.ObjectId,
      ref: 'persons',
      required: true
    },
    token: String
  },
  { timestamps: true }
)
