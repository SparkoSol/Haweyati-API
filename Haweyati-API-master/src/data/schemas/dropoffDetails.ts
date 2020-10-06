import { Schema } from "mongoose";
import { LocationSchema } from './location.schema'

export const DropoffDetailsSchema = new Schema({
  dropoffLocation: {
    type: LocationSchema,
    required: true
  },
  dropoffAddress: {
    type: String,
    required: false
  },
  dropoffDate: {
    type: Date,
    required: false
  },
  dropoffTime: {
    type: String,
    required: false
  }
},
  {_id: false})