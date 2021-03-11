import { Document } from "mongoose";

export interface ICoupon extends Document{
  name: string
  code: string
  value: number
  usedBy: [string]
  isOneTime: boolean
  expiry: Date
}