import {Document} from "mongoose";
import { IPerson } from './person.interface'

export interface IFcmMessages extends Document{
   person : IPerson[]
   message : {
      title: string,
      body : string
   }
}