import { Schema } from 'mongoose'

export const FcmPendingSchema = new Schema(
  {
    person: {
      type: Schema.Types.ObjectId,
      ref: 'persons',
      required: true
    },
    messages: {
      type: [String],
      required: true
    }
  },
  { timestamps: true }
)
