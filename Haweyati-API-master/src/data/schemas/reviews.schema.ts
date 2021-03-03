import { Schema } from "mongoose";

export const ReviewsSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'customers',
    required: true
  },
  supplier: {
    type: Schema.Types.ObjectId,
    ref: 'shopregistration',
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'drivers',
    required: true
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'orders',
    required: true
  },
  supplierFeedback: {
    type: String,
  },
  driverFeedback: {
    type: String,
    required: true
  },
  supplierRating: {
    type: Number
  },
  driverRating: {
    type: Number
  },
}, {timestamps: true})