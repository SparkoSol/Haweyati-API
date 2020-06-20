import {Schema} from "mongoose";

export const ShopRegistrationSchema = new Schema({
    name: String,
    location: {
        type: Schema.Types.ObjectId,
        ref: 'location',
        required: true
    },
    email: String,
    contact: String,
    city: String
});