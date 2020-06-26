import {Schema} from "mongoose";
import { ImagesSchema } from './images.schema';
import { FinishingMaterialVarientSchema } from './finishingMaterialVarients.schema';

export const FinishingMaterialsSchema = new Schema({
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
    ref: 'finishingmaterialcategory',
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
  varients: {
    type: {
      name: [String],
      values: [FinishingMaterialVarientSchema]
    },
    required: true
  }
});