import { Document, Schema } from 'mongoose';
import {IPerson} from './person.interface';
import { IVehicles } from './vehicles.interface';

export interface IDriversInterface extends Document{
   profile: IPerson,
   vehicle : IVehicles,
   status: string
}