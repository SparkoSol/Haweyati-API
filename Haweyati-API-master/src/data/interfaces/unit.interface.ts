import { Document } from 'mongoose'

export interface IUnit extends Document{
  name: string
  volumetricWeight: number
  cbmLength: number
  cbmWidth: number
  cbmHeight: number
}