import {Schema} from "mongoose";

export const PersonVerificationSchema = new Schema({
    Person : {
        type: Schema.Types.ObjectId,
        ref: "persons",
        required: true
    },
    VerificationCode : String,
    Verified : {

        type: Boolean }
});