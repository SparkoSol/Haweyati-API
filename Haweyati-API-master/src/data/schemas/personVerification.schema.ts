import {Schema} from "mongoose";
import {PersonsSchema} from "./persons.schema";

export const PersonVerificationSchema = new Schema({
    Person : {
        type: Schema.Types.ObjectId,
        ref: "persons",
        required: true
    },
    VerificationCode : String,
    Verified : Boolean
});