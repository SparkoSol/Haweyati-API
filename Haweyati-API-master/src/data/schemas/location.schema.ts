import {Schema} from "mongoose";

export const LocationSchema = new Schema({
  latitude: {
    type: String,
  },
  longitude: {
    type: String,
  }
});
