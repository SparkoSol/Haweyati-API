import * as moment from 'moment'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { FcmService } from '../fcm/fcm.service'
import { PersonsService } from '../persons/persons.service'
import { SimpleService } from '../../common/lib/simple.service'
import { CustomersService } from '../customers/customers.service'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { IOrders, OrderStatus } from '../../data/interfaces/orders.interface'
import { AdminNotificationsService } from '../admin-notifications/admin-notifications.service'

@Injectable()
export class OrdersService extends SimpleService<IOrders> {
  constructor(
    @InjectModel('orders')
    protected readonly model: Model<IOrders>,
    protected readonly fcmService: FcmService,
    protected readonly personsService: PersonsService,
    protected readonly customersService: CustomersService,
    protected readonly adminNotificationsService: AdminNotificationsService
  ) {
    super(model)
  }

  async create(document: IOrders): Promise<IOrders> {
    console.log(document)

    const customer = await this.customersService.fetch(
      // @ts-ignore
      document.customer._id.toString()
    )
    if (customer.status != 'Blocked') {
      document.orderNo =
        'HW' +
        moment().format('YY') +
        moment().format('MM') +
        (
          '0000' +
          ((await this.model
            .find({
              createdAt: {
                $lt: moment().endOf('month'),
                $gte: moment().startOf('month')
              }
            })
            .countDocuments()
            .exec()) +
            1)
        ).slice(-4)

      //order generation
      const orderCreated = await super.create(document)

      //notification for admin
      if (orderCreated) {
        const notification = {
          type: 'Order',
          title: 'New Order',
          message: 'New Order generated with Ref. # ' + document.orderNo + '.'
        }
        await this.adminNotificationsService.create(notification)
      }
      orderCreated.customer = customer
      // @ts-ignore
      return orderCreated
    } else {
      throw new HttpException(
        "You are blocked by Admin! You can't place order, contact Haweyati Support for help.",
        HttpStatus.NOT_ACCEPTABLE
      )
    }
  }

  async addImage(data: any): Promise<IOrders> {
    let order = (await this.model.findById(data.id)) as IOrders
    if (order.image) order.image.push(data.image)
    else {
      // @ts-ignore
      order.image = [data.image]
    }

    // @ts-ignore
    return (await order.save()).image.name
  }

  async getPerson(all: any): Promise<any> {
    if (Array.isArray(all)) {
      for (let data of all) {
        data.customer.profile = await this.personsService.fetch(
          data.customer.profile
        )
      }
    } else {
      all.customer.profile = await this.personsService.fetch(
        all.customer.profile
      )
    }
    return all
  }

  async getByCustomerId(id: string): Promise<IOrders[]> {
    return await this.model
      .find({ customer: id })
      .sort({ createdAt: -1 })
      .exec()
  }

  async getSearchByCustomerId(id: string, name?: string): Promise<IOrders[]> {
    let data: any

    if (name) {
      data = await this.model
        .find({
          customer: id,
          $or: [
            { service: { $regex: name, $options: 'i' } },
            { orderNo: { $regex: name, $options: 'i' } }
          ]
        })
        .populate('customer')
        .sort({ createdAt: -1 })
        .exec()
    } else {
      data = await this.model
        .find({
          customer: id
        })
        .populate('customer')
        .sort({ createdAt: -1 })
        .exec()
    }
    return this.getPerson(data)
  }

  async getByDriverId(id: string): Promise<IOrders[]> {
    return this.getPerson(
      await this.model
        .find({ 'driver._id': id })
        .populate('customer')
        .sort({ createdAt: -1 })
        .exec()
    )
  }

  async completedDriverId(id: string): Promise<IOrders[]> {
    return this.getPerson(
      await this.model
        .find({ 'driver._id': id, status: OrderStatus.Delivered })
        .populate('customer')
        .sort({ createdAt: -1 })
        .exec()
    )
  }

  async getBySupplierId(id: string): Promise<any> {
    let result = new Set()
    const orders = (await this.fetch()) as IOrders[]
    for (let order of orders) {
      for (let one of order.items) {
        // @ts-ignore
        if (one.supplier?._id == id && (order.status == OrderStatus.Accepted || order.status == OrderStatus.Preparing)) {
          result.add(order)
        }
      }
    }
    return Array.from(result)
  }

  async completedSupplierId(id: string): Promise<any> {
    let result = new Set()
    const orders = (await this.getPerson(
      await this.model
        .find({ status: OrderStatus.Delivered })
        .populate('customer')
        .sort({ createdAt: -1 })
        .exec()
    )) as IOrders[]
    for (let order of orders) {
      for (let one of order.items) {
        // @ts-ignore
        if (one.supplier?._id == id) {
          result.add(order)
        }
      }
    }
    return Array.from(result)
  }

  async dispatchedSupplier(id: string): Promise<any> {
    let result = new Set()
    const orders = (await this.getPerson(
      await this.model
        .find({ status: OrderStatus.Dispatched })
        .populate('customer')
        .sort({ createdAt: -1 })
        .exec()
    )) as IOrders[]
    for (let order of orders) {
      for (let one of order.items) {
        // @ts-ignore
        if (one.supplier?._id == id) {
          result.add(order)
        }
      }
    }
    return Array.from(result)
  }

  async dispatchedDriver(id: string): Promise<any> {
    return (await this.getPerson(
      await this.model
        .find({ status: OrderStatus.Dispatched, 'driver._id': id })
        .populate('customer')
        .sort({ createdAt: -1 })
        .exec()
    )) as IOrders[]
  }

  async preparingDriver(id: string): Promise<any> {
    return (await this.getPerson(
      await this.model
        .find({ status: OrderStatus.Preparing, 'driver._id': id })
        .populate('customer')
        .sort({ createdAt: -1 })
        .exec()
    )) as IOrders[]
  }

  async fetch(id?: string): Promise<IOrders[] | IOrders> {
    if (id) {
      let data = await this.model
        .findById(id)
        .populate('customer')
        .exec()
      return await this.getPerson(data)
    } else {
      let all = await this.model
        .find()
        .populate('customer')
        .sort({ createdAt: -1 })
        .exec()
      all = await this.getPerson(all)
      return all
    }
  }

  //also used in reports module
  async getByStatus(status: OrderStatus) {
    let all = await this.model
      .find({ status })
      .populate('customer')
      .sort({ createdAt: -1 })
      .exec()
    all = await this.getPerson(all)
    return all
  }

  async updateStatus(id: string, status: OrderStatus) {
    await this.model.findByIdAndUpdate(id, { status }).exec()
    const order = await this.model.findById(id).exec()
    const persons: string[] = []

    // @ts-ignore
    persons.push(
      (
        await this.customersService.fetch(order.customer.toString())
      ).profile._id.toString()
    )
    if (order.driver) {
      // @ts-ignore
      persons.push(order.driver.profile._id.toString())
    }
    for (let item of order.items) {
      if (item.supplier) {
        // @ts-ignore
        persons.push(item.supplier.person._id.toString())
      }
    }

    let notificationStatus: string
    switch (status) {
      case OrderStatus.Accepted:
        notificationStatus = 'Accepted'
      case OrderStatus.Delivered:
        notificationStatus = 'Delivered'
      case OrderStatus.Dispatched:
        notificationStatus = 'Dispatched'
      case OrderStatus.Pending:
        notificationStatus = 'Pending'
      case OrderStatus.Preparing:
        notificationStatus = 'Preparing'
      case OrderStatus.Cancelled:
        notificationStatus = 'Cancelled'
      case OrderStatus.Approved:
        notificationStatus = 'Approved'
      case OrderStatus.Rejected:
        notificationStatus = 'Rejected'
    }

    for (let id of persons) {
      await this.fcmService.sendSingle({
        id: id,
        title: 'Order Status Update',
        body: 'Your Order Status has been changed to ' + notificationStatus
      })
    }
    return order
  }

  async search(query: any) {
    let data = await this.model
      .find({
        $or: [
          { service: { $regex: query.name, $options: 'i' } },
          { orderNo: { $regex: query.name, $options: 'i' } }
        ],
        status: OrderStatus.Pending
      })
      .populate('customer')
      .sort({ createdAt: -1 })
      .exec()

    return this.getPerson(data)
  }

  async viewOrders(data: any): Promise<any> {
    let results = new Set()
    const orders = await this.model
      .find({ city: data.city })
      .sort({ createdAt: -1 })
      .exec()
    for (const index of orders) {
      for (const item of data.services) {
        if (index.service == item) {
          results.add(index)
        }
      }
    }
    return Array.from(results)
  }

  async getByDate(date: string): Promise<any[]> {
    let orders = await this.getByStatus(OrderStatus.Delivered)
    let result = []
    for (let order of orders) {
      // @ts-ignore
      const convertedDate = moment(order.updatedAt).format('MM-DD-YYYY')
      if (convertedDate == date) {
        result.push(order)
      }
    }
    return result
  }
  async getByWeek(date: number): Promise<any[]> {
    let orders = await this.getByStatus(OrderStatus.Delivered)
    let result = []
    for (let order of orders) {
      // @ts-ignore
      const convertedDate = moment(order.updatedAt).week()
      if (date == convertedDate) {
        result.push(order)
      }
    }
    return result
  }
  async getByMonth(date: number): Promise<any[]> {
    let orders = await this.getByStatus(OrderStatus.Delivered)
    let result = []
    for (let order of orders) {
      // @ts-ignore
      const convertedDate = moment(order.updatedAt).month() + 1
      if (date == convertedDate) {
        result.push(order)
      }
    }
    return result
  }
  async getByYear(date: number): Promise<any[]> {
    let orders = await this.getByStatus(OrderStatus.Delivered)
    let result = []
    for (let order of orders) {
      // @ts-ignore
      const convertedDate = moment(order.updatedAt).year()
      if (date == convertedDate) {
        result.push(order)
      }
    }
    return result
  }
  async getCustom(date: string, dateTo: string): Promise<any[]> {
    let orders = await this.getByStatus(OrderStatus.Delivered)
    let result = []
    for (let order of orders) {
      // @ts-ignore
      const convertedDate = moment(order.updatedAt).format('MM-DD-YYYY')
      if (convertedDate >= date && convertedDate <= dateTo) {
        result.push(order)
      }
    }
    return result
  }

  // async getByProduct(date: string, dateTo: string): Promise<any[]>{
  //   let orders = await this.getByStatus('completed')
  //   let name = [], qty = [], total = [], result = []
  //   for (let order of orders){
  //     // @ts-ignore
  //     const convertedDate = moment(order.updatedAt).format('MM-DD-YYYY')
  //     if (convertedDate >= date && convertedDate <= dateTo){
  //       for (let i=0; i< order.details.items.length; ++i){
  //         let flag: boolean = false
  //         switch (order.service) {
  //           case 'Construction Dumpster': {
  //             if (name.length > 0) {
  //               for (let j = 0; j < name.length; ++j) {
  //                 if (name[j] == order.details.items[i].product.size + ' Yard Dumpster') {
  //                   qty[j] += 1
  //                   total[j] += +order.details.items[i].total
  //                   flag = true
  //                   break
  //                 }
  //               }
  //               if (!flag){
  //                 name.push(order.details.items[i].product.size + ' Yard Dumpster')
  //                 qty.push(1)
  //                 total.push(+order.details.items[i].total)
  //                 break
  //               }
  //             } else {
  //               name.push(order.details.items[i].product.size + ' Yard Dumpster')
  //               qty.push(1)
  //               total.push(+order.details.items[i].total)
  //             }
  //           }
  //           case 'Building Material': {
  //             if (name.length > 0) {
  //               for (let j = 0; j < name.length; ++j) {
  //                 if (name[j] == (order.details.items[i].product.name + ' ' + order.details.items[i].size)) {
  //                   qty[j] += +order.details.items[i].qty
  //                   total[j] += +order.details.items[i].total
  //                   flag = true
  //                   break
  //                 }
  //               }
  //               if (!flag){
  //                 name.push(order.details.items[i].product.name + ' ' + order.details.items[i].size)
  //                 qty.push(+order.details.items[i].qty)
  //                 total.push(+order.details.items[i].total)
  //                 break
  //               }
  //             } else {
  //               name.push(order.details.items[i].product.name + ' ' + order.details.items[i].size)
  //               qty.push(+order.details.items[i].qty)
  //               total.push(+order.details.items[i].total)
  //             }
  //           }
  //           case 'Finishing Material': {
  //             if (name.length > 0) {
  //               for (let j = 0; j < name.length; ++j) {
  //                 if (name[j] == (order.details.items[i].product.name)) {
  //                   qty[j] += +order.details.items[i].qty
  //                   total[j] += +order.details.items[i].total
  //                   flag = true
  //                   break
  //                 }
  //                 if (!flag){
  //                   name.push(order.details.items[i].product.name)
  //                   qty.push(+order.details.items[i].qty)
  //                   total.push(+order.details.items[i].total)
  //                   break
  //                 }
  //               }
  //             } else {
  //               name.push(order.details.items[i].product.name)
  //               qty.push(+order.details.items[i].qty)
  //               total.push(+order.details.items[i].total)
  //             }
  //           }
  //           case 'Scaffolding': {
  //             if (name.length > 0) {
  //               for (let j = 0; j < name.length; ++j) {
  //                 if (name[j] == (order.details.items[i].name + ' ' + order.details.items[i].size)) {
  //                   qty[j] += +order.details.items[i].qty
  //                   total[j] += +order.details.items[i].total
  //                   flag = true
  //                   break
  //                 }
  //                 if (!flag){
  //                   name.push(order.details.items[i].name + ' ' + order.details.items[i].size)
  //                   qty.push(+order.details.items[i].qty)
  //                   total.push(+order.details.items[i].total)
  //                   break
  //                 }
  //               }
  //             } else {
  //               name.push(order.details.items[i].name + ' ' + order.details.items[i].size)
  //               qty.push(+order.details.items[i].qty)
  //               total.push(+order.details.items[i].total)
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  //   for (let i=0; i< name.length; ++i){
  //     result.push({
  //       name: name[i],
  //       quantity: qty[i],
  //       total: total[i]
  //     })
  //   }
  //   return result
  // }

  async AddSupplierToItem(data: any): Promise<any> {
    const order = await this.model.findById(data._id).exec()
    const orderItem = order.items[data.item]

    if (data.flag) {
      if (orderItem.supplier) return 'Invalid Operation'
      else {
        orderItem.supplier = data.supplier
        // @ts-ignore
        orderItem.reason = undefined
      }
    } else {
      // @ts-ignore
      if (orderItem?.supplier?._id == data.supplier._id) {
        orderItem.supplier = null
        // @ts-ignore
        orderItem.reason = {
          supplier: data.supplier._id,
          message: data.reason
        }
      } else return 'Invalid Operation'
    }

    /// Change order status;
    if (this.shouldActivateOrder(order)) {
      order.status = OrderStatus.Accepted
    } else {
      order.status = OrderStatus.Approved
    }

    return order.save()
  }

  async AddDriver(data: any): Promise<any> {
    if (data.flag) {
      if (!(await this.model.findById(data._id).exec()).driver) {
        return await this.model
          .findOneAndUpdate(
            { _id: data._id },
            { driver: data.driver, status: OrderStatus.Preparing }
          )
          .exec()
      } else {
        throw new HttpException(
          'Order Not Available!',
          HttpStatus.NOT_ACCEPTABLE
        )
      }
    } else {
      return await this.model
        .findOneAndUpdate(
          { _id: data._id },
          { driver: undefined, status: OrderStatus.Accepted }
        )
        .exec()
    }
  }

  shouldActivateOrder(order: IOrders): boolean {
    if (order.items.length > 1) {
      for (const item of order.items) {
        if (!item.supplier) return false
      }
      return true
    }

    return !!order.items[0].supplier
  }

  async filter(data: any): Promise<IOrders[]> {
    let result = new Set<any>()
    let orders = await this.model
      .find({ city: data.city, status: OrderStatus.Approved })
      .populate('customer')
      .sort({ createdAt: -1 })
      .exec()
    for (let order of orders) {
      if (data.services.includes(order.service)) {
        // @ts-ignore
        order.customer.profile = await this.personsService.fetch(
          // @ts-ignore
          order.customer.profile
        )
        result.add(order)
      }
    }
    return Array.from(result)
  }

  async pickupUpdate(data: any): Promise<any> {
    let order = (await this.model.findById(data._id).exec()) as IOrders
    for (let item of order.items) {
      // @ts-ignore
      if (item.supplier._id == data.supplierId) {
        item.dispatched = true
        break
      }
    }

    order = await order.save()
    for (let item of order.items) {
      if (item.dispatched != true) return order
    }
    return await this.model
      .findByIdAndUpdate(order._id, { status: OrderStatus.Dispatched })
      .exec()
  }
}
