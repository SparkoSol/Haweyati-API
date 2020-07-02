import { Schema } from "mongoose";

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
