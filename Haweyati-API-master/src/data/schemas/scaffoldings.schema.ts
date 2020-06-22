import {Schema} from "mongoose";
import { Options } from '@nestjs/common';

export const ScaffoldingsSchema = new Schema({
  name: String,
  price: Number,
  type: String,
  others: Options
});