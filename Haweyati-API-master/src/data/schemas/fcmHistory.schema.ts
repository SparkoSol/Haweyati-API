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
  status : {
    type: Number,
    required: true
  }
}, {timestamps: true})