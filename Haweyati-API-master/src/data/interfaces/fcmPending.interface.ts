import {Document } from "mongoose";
import { IPerson } from "./person.interface";

export interface IFcmPending extends Document{
   person : IPerson,
   messages : string[]
}