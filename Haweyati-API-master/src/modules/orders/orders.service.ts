import * as moment from 'moment'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { PersonsService } from '../persons/persons.service'
import { SimpleService } from '../../common/lib/simple.service'
import { CustomersService } from '../customers/customers.service'
import { NoGeneratorUtils } from '../../common/lib/no-generator-utils'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { IOrders, OrderStatus } from '../../data/interfaces/orders.interface'
import { AdminNotificationsService } from '../admin-notifications/admin-notifications.service'

@Injectable()
export class OrdersService extends SimpleService<IOrders> {
  constructor(
    @InjectModel('orders')
    protected readonly model: Model<IOrders>,
    protected readonly personsService: PersonsService,
    protected readonly customersService: CustomersService,
    protected readonly adminNotificationsService : AdminNotificationsService
  ) {
    super(model)
  }

  async create(document: IOrders): Promise<IOrders> {

    const customer = await this.customersService.fetch(document.customer.toString())
    if (customer.status != 'Blocked'){

      document.orderNo = await NoGeneratorUtils.generateCode()

      //order generation
      const orderCreated = super.create(document)

      //notification for admin
      if (orderCreated){
        const notification = {
          type: 'Order',
          title: 'New Order',
          message: 'New Order generated with id : '+ document.orderNo +'.'
        }
        this.adminNotificationsService.create(notification);
      }
      return orderCreated;
    } else {
      throw new HttpException(
        "You are blocked by Admin! You can't place order, contact Haweyati Support for help.",
        HttpStatus.NOT_ACCEPTABLE
      )
    }
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

  async getByCustomerId(id: string): Promise<IOrders[]>{
    return await this.model.find({customer: id}).exec()
  }

  async getByDriverId(id: string): Promise<IOrders[]>{
    return this.model.find({ 'driver._id': id }).exec()
  }

  async getBySupplierId(id: string): Promise<any>{
    let result = new Set()
    const orders = (await this.fetch()) as IOrders[]
    for (let order of orders){
      for (let one of order.items){
        // @ts-ignore
        if (one.supplier?._id == id){
          result.add(order)
        }
      }
    }
    return Array.from(result)
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
      .exec()
    all = await this.getPerson(all)
    return all
  }

  updateStatus(id: string, status: OrderStatus) {
    return this.model.findByIdAndUpdate(id, { status }).exec();
  }

  async search(query : any) {
    let data = await this.model.find({
      $or: [
        {'service': { $regex: query.name, $options: "i" }},
        {'orderNo': { $regex: query.name, $options: "i" }}
      ],
      status: OrderStatus.Pending
    }).populate('customer').exec();

    return this.getPerson(data)
  }

  async viewOrders(data: any): Promise<any>{
    let results = new Set()
    const orders = await this.model.find({city: data.city}).exec()
    for (const index of orders){
      for (const item of data.services){
        if (index.service == item){
          results.add(index)
        }
      }
    }
    return Array.from(results);
  }

  async getByDate(date: string): Promise<any[]> {
    let orders = await this.getByStatus(OrderStatus.Closed)
    let result = []
    for (let order of orders){
      // @ts-ignore
      const convertedDate = moment(order.updatedAt).format('MM-DD-YYYY')
      if (convertedDate == date){
        result.push(order)
      }
    }
    return result
  }
  async getByWeek(date: number): Promise<any[]> {
    let orders = await this.getByStatus(OrderStatus.Closed)
    let result = []
    for (let order of orders){
      // @ts-ignore
      const convertedDate = moment(order.updatedAt).week()
      if (date == convertedDate){
        result.push(order)
      }
    }
    return result
  }
  async getByMonth(date: number): Promise<any[]> {
    let orders = await this.getByStatus(OrderStatus.Closed)
    let result = []
    for (let order of orders){
      // @ts-ignore
      const convertedDate = moment(order.updatedAt).month() + 1
      if (date == convertedDate){
        result.push(order)
      }
    }
    return result
  }
  async getByYear(date: number): Promise<any[]> {
    let orders = await this.getByStatus(OrderStatus.Closed)
    let result = []
    for (let order of orders){
      // @ts-ignore
      const convertedDate = moment(order.updatedAt).year()
      if (date == convertedDate){
        result.push(order)
      }
    }
    return result
  }
  async getCustom(date: string, dateTo: string): Promise<any[]>{
    let orders = await this.getByStatus(OrderStatus.Closed)
    let result = []
    for (let order of orders){
      // @ts-ignore
      const convertedDate = moment(order.updatedAt).format('MM-DD-YYYY')
      if (convertedDate >= date && convertedDate <= dateTo){
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
    const order = await this.model.findById(data._id).exec();
    const orderItem = order.items[data.item];

    if (data.flag) {
      if (orderItem.supplier) return 'Invalid Operation';
      else orderItem.supplier = data.supplier
    } else {
      // @ts-ignore
      if (orderItem?.supplier?._id == data.supplier._id) orderItem.supplier = null;
      else return 'Invalid Operation';
    }

    /// Change order status;
    if (this.shouldActivateOrder(order)) {
      order.status = OrderStatus.Active;
    } else {
      order.status = OrderStatus.Pending;
    }

    return order.save();
  }

  async AddDriver(data: any): Promise<any>{
    if (data.flag){
      if (!(await this.model.findById(data._id).exec()).driver){
        return await this.model.findOneAndUpdate({_id: data._id}, {driver: data.driver, status: OrderStatus.Dispatched}).exec()
      }else {
        throw new HttpException(
          'Order Not Available!',
          HttpStatus.NOT_ACCEPTABLE
        )
      }
    }
    else {
      return await this.model.findOneAndUpdate({_id: data._id}, {driver: undefined, status: OrderStatus.Active}).exec()
    }
  }

  shouldActivateOrder(order: IOrders): boolean {
    if (order.items.length > 1) {
      for (const item of order.items) {
        if (!item.supplier) return false;
      }
      return true;
    }

    return !!order.items[0].supplier
  }
}