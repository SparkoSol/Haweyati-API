import { Schema } from 'mongoose'
import { ImagesSchema } from './images.schema'

export const ServicesRequestsSchema = new Schema(
  {
    suppliers: {
      type: Schema.Types.ObjectId,
      ref: 'shopregistration',
      required: false
    },
    type: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    data: {
      type: Object,
      required: false
    },
    status: {
      type: String,
      required: false,
      default: 'Pending'
    },
    note: {
      type: String,
      required: false
    },
    requestNo : {
      type: String,
      required: true
    },
    image : {
      type: ImagesSchema,
      required: false
    }
  },
  { timestamps: true }
)
