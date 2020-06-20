import { Schema } from "mongoose";

export const DriversSchema = new Schema({
  profile: {
    type: Number,
    required: true
  }
});
