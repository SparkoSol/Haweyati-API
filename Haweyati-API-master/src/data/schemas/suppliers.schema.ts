import { Schema } from "mongoose";
import { LocationSchema } from './location.schema';
import { ImagesSchema } from './images.schema';

export const SuppliersSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  image: {
    type: ImagesSchema
  },
  location:{
    type: LocationSchema,
    required: true
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'suppliers',
    default: null
  },
  services: {
    type: [String],
    required: true
  },
});
