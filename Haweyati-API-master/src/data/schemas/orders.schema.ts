import { Schema } from 'mongoose'
import { ImagesSchema } from './images.schema'
import { DropoffDetailsSchema } from './dropoffDetails'

export const OrdersSchema = new Schema(
  {
    service: {
      type: String,
      required: false
    },
    image: [{
        ...ImagesSchema,
        sort: String
    }],
    dropoff: {
      type: DropoffDetailsSchema
    },
    details: {
      type: Object,
      required: false
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'customers',
      required: false
    },
    status: {
      type: String,
      required: false,
      default: 'pending'
    },
    paymentType: {
      type: String,
      required: false
    },
    paymentIntentId: {
      type: String,
      required: false
    },
    note: {
      type: String,
      required: false
    },
    orderNo: {
      type: String,
      required: true,
      unique: true
    },
    city: {
      type: String,
      required: true
    },
    reason : {
      type: String,
      required: false
    }
  },
  { timestamps: true }
)
