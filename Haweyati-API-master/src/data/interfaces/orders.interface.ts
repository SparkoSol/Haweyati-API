import { Document } from 'mongoose'
import { ILocation } from './location.interface'
import { IImage } from './image.interface'
import { ICustomerInterface } from './customers.interface'
import { IDropoffDetails } from './dropoffDetails.interface'

export interface IOrdersInterface extends Document {
  service: string
  dropoff: IDropoffDetails
  image: IImage
  details: any
  customer: ICustomerInterface | string
  status: string
  paymentType: string
  paymentIntentId: string
}
