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
    required: true
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'drivers',
    required: true
  },
  supplierFeedback: {
    type: String,
    required: true
  },
  driverFeedback: {
    type: String,
    required: true
  },
}, {timestamps: true})