import { Schema } from "mongoose";
import { OrdersSchema } from './orders.schema';
import { DriversSchema } from './drivers.schema';

export const OrderDriversSchema = new Schema({
  order: {
    type: OrdersSchema,
    required: true
  },
  driver: {
    type: DriversSchema,
    required: true
  }
});
