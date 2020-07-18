import {Document} from "mongoose";
import { IPerson } from "./person.interface";

export interface IFcm extends Document{
   person : IPerson
   token : string
}