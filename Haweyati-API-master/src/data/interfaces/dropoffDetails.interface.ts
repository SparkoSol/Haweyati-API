import { ILocation } from './location.interface'

export interface IDropoffDetails {
  dropoffLocation: ILocation,
  dropoffAddress : string,
  dropoffDate: Date,
  dropoffTime: string
}