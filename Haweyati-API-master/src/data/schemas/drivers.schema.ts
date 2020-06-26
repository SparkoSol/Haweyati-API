import { Schema } from "mongoose";
import { VehiclesSchema } from './vehicles.schema';

export const DriversSchema = new Schema({
  profile: {
    type: Schema.Types.ObjectId,
    ref : "persons",
    required: true
  },
  vehicle : VehiclesSchema,
  status: {
    type: String,
    required: false,
    default: "false"
  }
});
