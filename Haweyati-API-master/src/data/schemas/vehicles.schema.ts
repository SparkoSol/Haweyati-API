import { Schema } from 'mongoose'

export const VehiclesSchema = {
   name: {
      type: String,
      required: true
   },
   model : {
      type: String,
      required: true
   },
   identificationNo: {
      type: String,
      unique: true,
      required: true
   },
   type : {
      type: Schema.Types.ObjectId,
      ref: 'vehicletype',
      required : true,
   }
}