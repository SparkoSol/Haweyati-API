import { Document } from 'mongoose';
import { IDumpster } from './dumpster.interface';

export interface IDumpsterAvailability extends Document {
  dumpster: IDumpster,
  city: string,
  rent: number,
  extraDayRent: number,
  rentDays: number,
}