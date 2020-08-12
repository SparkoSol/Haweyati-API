import { Schema } from 'mongoose'

export const AdminNotificationSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  seen : {
    type: Boolean,
    required: false,
    default: false
  }
},
  {timestamps: true})