import { Schema } from 'mongoose'

export const UnitSchema = new Schema({
  name: {
    type: String,
    required: true
  }
})