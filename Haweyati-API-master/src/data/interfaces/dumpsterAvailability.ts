import { Document } from 'mongoose';
import { IUser } from 'src/common/auth/users/user.interface';

export interface IDumpsterAvailability extends Document {
  dumpster: string,
  city: string,
  rent: number,
  extraDayRent: number,
  rentDays: number,
}