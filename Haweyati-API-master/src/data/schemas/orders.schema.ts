import { Schema } from "mongoose";
import { CustomersSchema } from './customers.schema';

export const OrdersSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  reference: {
    type: String,
  },
  pickupTime: {
    type: Date
  },
  pickupLocation: {
    type: Location,
  },
  deliveryTime: {
    type: Date
  },
  deliveryLocation:{
    type: Number,
  },
  deliveryCharges: {
    type: Number,
  },
  customer: {
    type: CustomersSchema
  },
  status: {
    type: String
  }
  

});
