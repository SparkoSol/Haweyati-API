import { Schema } from 'mongoose'
import { VehiclesSchema } from './vehicles.schema'
import { LocationSchema } from './location.schema'

export const DriversSchema = new Schema(
  {
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'persons',
      required: true
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'suppliers',
      required: false
    },
    license: {
      type: String,
      required: true
    },
    location: {
      type: LocationSchema,
      required: false
    },
    city: String,
    vehicle: VehiclesSchema,
    status: {
      type: String,
      required: false,
      default: 'Pending'
    }
  },
  { timestamps: true }
)
