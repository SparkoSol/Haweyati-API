import { Document } from 'mongoose'
import { IDriver } from './drivers.interface'

export interface IDriverRequest extends Document {
  driver: IDriver | string
  status: string
  message: string
}
