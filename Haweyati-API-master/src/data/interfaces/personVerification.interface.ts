import {Document} from "mongoose";
import {IPerson} from "./person.interface";

export interface IPersonVerification extends Document{
    Person : string | IPerson,
    VerificationCode : string,
    Verified : boolean
}