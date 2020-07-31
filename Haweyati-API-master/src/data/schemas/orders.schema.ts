import { Schema } from 'mongoose'
import { ImagesSchema } from './images.schema'
import { DropoffDetailsSchema } from './dropoffDetails'

export const OrdersSchema = new Schema(
  {
    service: {
      type: String,
      required: true
    },
    image: {
      type: {
        ...ImagesSchema,
        type: String
      },
      required: false
    },
    dropoff: {
      type: DropoffDetailsSchema
    },
    details: {
      type: Object,
      required: true
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'customers',
      required: true
    },
    status: {
      type: String,
      required: false,
      default: 'Pending'
    },
    paymentType: {
      type: String,
      required: true
    },
    paymentIntentId: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
)
