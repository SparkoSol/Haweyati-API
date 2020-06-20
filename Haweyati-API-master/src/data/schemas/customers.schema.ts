import { Schema } from "mongoose";

export const CustomersSchema = new Schema({
  profile: {
    type: Number,
    required: true
  }
});
