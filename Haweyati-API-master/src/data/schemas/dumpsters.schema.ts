import { Schema } from "mongoose";
import { ImagesSchema } from './images.schema';

export const DumpstersSchema = new Schema({
  size: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  suppliers: [{
    type: Schema.Types.ObjectId,
    ref: 'shopregistration',
    required: false
  }],
  image: {
    type: ImagesSchema,
    required: true
  },
  pricing : [{
    city: String,
    rent: Number,
    days: Number,
    extraDayRent : Number,
    helperPrice: Number
  }],
  status: {
    type: String,
    required: false,
    default: 'Active'
  }
});