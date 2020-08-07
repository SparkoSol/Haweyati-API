import { Document } from 'mongoose'

export interface ITimeSlots extends Document {
  category: string
  from: string
  to: string
}
