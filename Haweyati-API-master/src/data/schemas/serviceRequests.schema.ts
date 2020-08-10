import { Schema } from 'mongoose'

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
    }
  },
  { timestamps: true }
)
