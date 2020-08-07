import { Schema } from 'mongoose'
import { strict } from 'assert'

export const FcmPendingSchema = new Schema(
  {
    person: {
      type: Schema.Types.ObjectId,
      ref: 'persons',
      required: true
    },
    messages: [{
      title: String,
      body : String
    }]
  },
  { timestamps: true }
)
