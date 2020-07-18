import { Schema } from "mongoose";

export const FcmMessagesSchema = new Schema({
   token : {
      type : Schema.Types.ObjectId,
      ref : 'fcm',
      required: true
   },
   message : {
      type: String,
      required: true
   },

}, {
   timestamps : true
})