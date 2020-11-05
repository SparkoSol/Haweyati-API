import { Document } from 'mongoose'
import { ICustomerInterface } from './customers.interface'
import { IDropoffDetails } from './dropoffDetails.interface'

export enum OrderStatus {
  Pending,
  Approved,
  Accepted,
  Preparing,
  Dispatched,
  Delivered,
  Rejected,
  Cancelled
}

export interface IOrders extends Document {
  service: string
  dropoff: IDropoffDetails
  image: [
    {
      name: string
      path: string
      sort: string
    }
  ]
  total: number
  items: [
    {
      item: Object
      subtotal: String
      supplier: Object
      reason: Object
      dispatched: boolean
    }
  ]
  driver: Object
  customer: ICustomerInterface | string
  status: OrderStatus
  paymentType: string
  paymentIntentId: string
  note: string
  orderNo: string
  city: string
  deliveryFee: Number
}
