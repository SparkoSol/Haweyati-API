import { Schema } from 'mongoose'

export const TimeSlotsSchema = new Schema({
  category: {
    type: String,
    required: true,
    unique: true
  },
  from: {
    type: String,
    required: false
  },
  to: {
    type: String,
    required: false
  }
})
