import { Document } from "mongoose";

export interface ICoupons extends Document{
  name: string
  code: string
  value: number
  usedBy: [string]
  isOneTime: boolean
  expiry: Date
}