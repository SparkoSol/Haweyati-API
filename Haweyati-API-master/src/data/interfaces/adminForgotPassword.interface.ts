import { Document } from 'mongoose'

export interface IAdminForgotPassword extends Document {
  hash: string
  email: string
}
