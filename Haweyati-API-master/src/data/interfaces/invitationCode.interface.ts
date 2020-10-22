import {Document} from 'mongoose'
import { IPerson } from './person.interface'

export interface IInvitationCode extends Document{
  person: IPerson | string
  code: string
  points: number
}