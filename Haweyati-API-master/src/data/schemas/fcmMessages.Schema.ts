import { Schema } from "mongoose";

export const FcmMessagesSchema = new Schema({
   person : [{
      type : Schema.Types.ObjectId,
      ref : 'persons',
      required: true
   }],
   message : {
      title: String,
      body : String
   },

}, {
   timestamps : true
})