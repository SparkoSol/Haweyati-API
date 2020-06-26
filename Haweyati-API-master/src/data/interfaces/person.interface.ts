import { Document } from 'mongoose';
import { IUser } from 'src/common/auth/users/user.interface';
import { ILocation } from './location.interface';

export interface IPerson extends IUser {
    name: string,
    contact: string,
    type: string,
    location: ILocation,
}