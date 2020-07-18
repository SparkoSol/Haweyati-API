import {Schema} from "mongoose";
import { ImagesSchema } from './images.schema';
import { LocationSchema } from './location.schema';
import { UsersSchema } from "../../common/auth/users/users.schema";

export const ShopRegistrationSchema = new Schema({
   ...UsersSchema,
   name: String,
   location: {
      type: LocationSchema,
      required: false
   },
   images: {
      type: [ImagesSchema],
      required: false
   },
   contact: String,
   email: String,
   address: String,
   parent: String,
   city: String,
   services : [String],
   status: {
      type: String,
      required: false,
      default: 'Pending'
   }
});