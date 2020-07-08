import {Schema} from "mongoose";
import { ImagesSchema } from './images.schema';
import { LocationSchema } from './location.schema';

export const ShopRegistrationSchema = new Schema({
   name: String,
   location: {
      type: LocationSchema,
      required: false
   },
   images: {
      type: [ImagesSchema],
      required: false
   },
   email: String,
   contact: String,
   address: String,
   parent: String,
   city: String,
   services : [String]
});