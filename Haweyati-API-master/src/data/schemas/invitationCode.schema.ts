import { Schema } from 'mongoose'

export const InvitationCodeSchema = new Schema({
  person: {
    type: Schema.Types.ObjectId,
    ref: 'persons',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  }
})