import {Document} from 'mongoose'

export interface IAdminNotification extends Document{
  type: string,
  title: string,
  message: string,
  seen : boolean
}