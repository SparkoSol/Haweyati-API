import { Schema } from "mongoose";
import { OrdersSchema } from './orders.schema';
import { DriversSchema } from './drivers.schema';

export const DumpsterAvailabilitySchema = new Schema({
  dumpster: {
    type: Schema.Types.ObjectId,
    ref: 'dumpsters',
    required: true
  },
  city: {
    type: String,
    required: true
  },
  rent: {
    type: Number,
    required: true
  },
  extraPayDayRent: {
    type: Number
  },
  rentDays: {
    type: Number
  },

});
