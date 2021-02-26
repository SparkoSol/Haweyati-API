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
  volumetricWeight: {
    type: Number,
    required: true
  },
  deliveryCharges: {
    type: Number,
    required: true
  },
  minDeliveryCharges: {
    type: Number,
    required: true
  },
  minDistance: {
    type: Number,
    required: true
  }
})