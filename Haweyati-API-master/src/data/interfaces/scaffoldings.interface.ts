import {Document} from "mongoose";
import { Options } from 'prettier';

export interface IScaffoldingsInterface extends Document{
  name: string,
  price: number,
  type: string,
  others: Options
}