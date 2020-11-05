import { Schema } from 'mongoose'
import { ImagesSchema } from './images.schema'
import { UsersSchema } from 'src/common/auth/users/users.schema'

export const PersonsSchema = new Schema(
  {
    ...UsersSchema,
    name: {
      type: String,
      required: true
    },
    scope: {
      type: [String]
    },
    email: {
      type: String,
      unique: true,
      sparse: true
    },
    image: {
      type: ImagesSchema,
      required: false
    },
    contact: {
      type: String,
      unique: true,
      required: true
    },
    token: {
      type: String
    },
    guest: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  { timestamps: true }
)
