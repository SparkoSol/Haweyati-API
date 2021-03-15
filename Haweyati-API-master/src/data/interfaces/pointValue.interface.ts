import { Document } from 'mongoose'

export interface IPointValue extends Document{
  value: number
  invitationPoints: number
  pointPercentage: number
}