import { Schema } from "mongoose";
import { LocationSchema } from "./location.schema";
import { UsersSchema } from "src/common/auth/users/users.schema";

export const PersonsSchema = new Schema({
    ...UsersSchema,

    name: {
        type: String,
        // required: true
    },
    type:{
      type : String,
      // required: true
    },
    contact: {
        type: String,
        unique: true,
        required: true
    },
    location: LocationSchema
});
