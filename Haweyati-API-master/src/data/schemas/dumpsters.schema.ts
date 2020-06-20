import { Schema } from "mongoose";
import { ImagesSchema } from './images.schema';

/**
 * @version 1.0.0
 * @author Haroon Awan <haroonashrafawan@gmail.com>
 */
export const DumpstersSchema = new Schema({
  size: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: {
    type: [ImagesSchema],
    required: true
  },
  pricing : [
    {city: String},
    {rent: Number},
    {days: Number},
    {extraDaysPrice : Number}
  ]
});
