import { Schema } from 'mongoose';

export const DriverRequestSchema = new Schema({
   driver : {
      type : Schema.Types.ObjectId,
      ref : "drivers",
      required : true
   },
   status : {
      type: String,
      default: "false",
      required: false
   }
})
