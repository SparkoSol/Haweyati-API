import { Schema } from "mongoose";
import { OrdersSchema } from './orders.schema';
import { DriversSchema } from './drivers.schema';

export const CouponsSchema = new Schema({
  discount: {
    type: Number,
    required: true
  },
  consumedB: {
    type: DriversSchema,
    required: true
  }
});
