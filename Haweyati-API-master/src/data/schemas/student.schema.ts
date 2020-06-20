import { Schema } from "mongoose";

export const StudentSchema = new Schema({

  name: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true
  },
  contact: {
    type: Number,
  }

});
