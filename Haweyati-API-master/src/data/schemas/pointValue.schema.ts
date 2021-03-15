import { Schema } from 'mongoose'

export const PointValueSchema = new Schema({
  value: {
    type: Number,
    required: true,
    default: 1.0
  },
  invitationPoints: {
    type: Number,
  },
  pointPercentage: {
    type: Number
  }
})