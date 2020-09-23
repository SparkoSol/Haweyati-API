import { Schema } from 'mongoose'
import { LocationSchema } from './location.schema'

export const ShopRegistrationSchema = new Schema(
  {
    person: {
      type: Schema.Types.ObjectId,
      ref: 'persons',
      required: true
    },
    location: {
      type: LocationSchema,
      required: false
    },
    parent: String,
    city: String,
    services: [String],
    status: {
      type: String,
      required: false,
      default: 'Pending'
    },
    message: {
      type: String,
      required: false,
      default: 'No Reason given by administrator'
    }
  },
  { timestamps: true }
)
