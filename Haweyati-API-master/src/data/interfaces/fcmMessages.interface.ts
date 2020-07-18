import {Document} from "mongoose";
import { IFcm } from "./fcm.interface";

export interface IFcmMessages extends Document{
   token : IFcm
   message : string
}