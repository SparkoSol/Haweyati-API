import { Schema } from 'mongoose'
import { ImagesSchema } from './images.schema'
import { DropoffDetailsSchema } from './dropoffDetails'
import { OrderStatus } from '../interfaces/orders.interface'

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
    total: {
      type: Number
    },
    items: [
      {
        item: Object,
        subtotal: String,
        supplier: Object
      }
    ],
    driver: {
      type: Object,
      required: false
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'customers',
      required: false
    },
    status: {
      type: Number,
      required: false,
      default: OrderStatus.Pending
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