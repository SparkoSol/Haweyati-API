import {Schema} from "mongoose";
import { ImagesSchema } from './images.schema';

export const BuildingMaterialsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'buildingmaterialcategory',
    required: false
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
    price: Number
  }]
});