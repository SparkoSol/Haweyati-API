import { Document } from 'mongoose'

export interface IFcmAllHistory extends Document{
  title: string
  body: string
}