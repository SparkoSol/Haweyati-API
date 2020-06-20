import { Schema } from "mongoose";

export const CitiesSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});
