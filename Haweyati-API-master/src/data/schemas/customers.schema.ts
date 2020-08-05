import { Schema } from 'mongoose'
import { LocationSchema } from './location.schema'

export const CustomersSchema = new Schema(
  {
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'persons',
      required: true
    },
    location: {
      type: LocationSchema,
      required: true
    },
    status: {
      type: String,
      required: false,
      default: 'Active'
    },
    message: {
      type: String,
      required: false,
      default: 'No Reason given by administrator'
    }
  },
  { timestamps: true }
)
