import { Schema } from "mongoose";

export const CouponsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Number,
    required: true
  },
  usedBy: {
    type: [String]
  },
  isOneTime: {
    type: Boolean,
    default: true
  },
  expiry: {
    type: Date
  }
},
  {timestamps: true})