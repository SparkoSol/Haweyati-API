import { Schema } from 'mongoose'

export const FcmAllHistory = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
}, {timestamps: true})