import { Schema } from 'mongoose'

export const UnitSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  volumetricWeight: {
    type: Number,
    required: true
  },
  cbmLength: {
    type: Number,
    required: true
  },
  cbmWidth: {
    type: Number,
    required: true
  },
  cbmHeight: {
    type: Number,
    required: true
  },
})