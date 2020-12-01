import { Schema } from 'mongoose'

export const FcmHistory = new Schema({
  person : {
    type: Schema.Types.ObjectId || String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  seen: {
    type: Boolean,
    default: false
  },
  status : {
    type: Number,
    required: true
  }
}, {timestamps: true})