import {Schema} from "mongoose";

export const LocationSchema = new Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type:  Number,
    required:true
  }
});
