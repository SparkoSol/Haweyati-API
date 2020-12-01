import { Document } from 'mongoose'
import { IPerson } from './person.interface'

export interface IFcmHistory extends Document{
  person: IPerson | string
  title: string
  body: string
  seen: boolean
  status: number
}

export enum FcmStatus {
  sent ,
  pending
}