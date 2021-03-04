import { Document } from 'mongoose'
import { ICustomerInterface } from './customers.interface'
import { IDropoffDetails } from './dropoffDetails.interface'

export enum OrderStatus {
  Pending,
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
  vat: number
  items: [
    {
      item: Object
      subtotal: string
      dispatched: boolean
    }
  ]
  supplierCancellationReason: Object
  supplier: Object
  driver: Object
  customer: ICustomerInterface | string
  status: OrderStatus
  paymentType: string
  paymentIntentId: string
  note: string
  orderNo: string
  city: string
  deliveryFee: number
  volumetricWeight: number
  cbm: number
  vehicleRounds: number
  tripId: string
  rating: number
  shareUrl: string
  reason: string
  itemReason: string
  rewardPointsValue: number
}
