import {Schema} from "mongoose";
import { ImagesSchema } from './images.schema';

export const FinishingMaterialCategorySchema = new Schema({
  name: {
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
  }
});