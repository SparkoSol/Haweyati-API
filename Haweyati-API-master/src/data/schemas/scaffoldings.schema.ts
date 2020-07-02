import {Schema} from "mongoose";
import { ImagesSchema } from './images.schema';

export const ScaffoldingsSchema = new Schema({
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
  images: {
    type: [ImagesSchema],
    required: true
  },
  pricing : [{
    city: String,
    rent: Number,
    days: Number,
    extraDayRent : Number
  }]
});