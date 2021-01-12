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
  volumetricWeight: {
    type: Number,
    required: true
  },
  deliveryCharges: {
    type: Number,
    required: true
  }
})