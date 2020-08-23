import {Document} from "mongoose";
import { IPerson } from './person.interface'

export interface IFcmMessages extends Document{
   person : IPerson[] | string[]
   message : {
      title: string,
      body : string
   }
}