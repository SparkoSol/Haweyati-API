import { Schema } from 'mongoose'
import { ImagesSchema } from './images.schema'

export const VehicleTypeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: ImagesSchema,
    required: false
  },
  maxWeight: {
    type: Number,
    required: true
  },
  maxVolume: {
    type: Number,
    required: true
  },
  minWeight: {
    type: Number,
    required: true
  },
  minVolume: {
    type: Number,
    required: true
  }
})