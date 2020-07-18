import { Schema } from "mongoose";
import { UsersSchema } from "src/common/auth/users/users.schema";
import { ImagesSchema } from './images.schema';

export const PersonsSchema = new Schema({
   ...UsersSchema,

   name: {
      type: String,
      // required: true
   },
   type:{
      type : String,
      // required: true
   },
   email: {
      type: String,
      required: false
   },
   image : {
      type: ImagesSchema,
      required: false
   },
   contact: {
      type: String,
      unique: true,
      required: true
   }
});
