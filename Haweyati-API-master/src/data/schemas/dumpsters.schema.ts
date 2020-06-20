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
  pricing : [{
    city: String,
    rent: Number,
    days: Number,
    extraDayRent : Number
  }]
});

// [Object: null prototype] {
//   size: '12',
//     description: '231316456',
//     suppliers: '5eede71730717f202c2de3bf',
//     city: [ 'multan', 'karachi' ],
//     rent: [ '12', '123' ],
//     days: [ '45', '54654' ],
//     extraDayRent: [ '1232', '465' ]
// }

