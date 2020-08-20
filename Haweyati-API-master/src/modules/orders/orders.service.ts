import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { SimpleService } from '../../common/lib/simple.service'
import { IOrdersInterface } from '../../data/interfaces/orders.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { PersonsService } from '../persons/persons.service'
import * as blake2 from 'blake2'
import { AdminNotificationsService } from '../admin-notifications/admin-notifications.service'
import { CustomersService } from '../customers/customers.service'

@Injectable()
export class OrdersService extends SimpleService<IOrdersInterface> {
  constructor(
    @InjectModel('orders')
    protected readonly model: Model<IOrdersInterface>,
    protected readonly personsService: PersonsService,
    protected readonly customersService: CustomersService,
    protected readonly adminNotificationsService : AdminNotificationsService
  )
  {
    super(model)
  }

  protected getRandomArbitrary() {
    return (Math.random() * (999999 - 100000) + 100000).toFixed(0);
  }

  async create(document: IOrdersInterface): Promise<IOrdersInterface> {

    const customer = await this.customersService.fetch(document.customer.toString())
    if (customer.status != 'Blocked'){

      //Order no generation
      let code = this.getRandomArbitrary();
      code = code+Date.now().toString()
      const h = blake2.createHash('blake2b', {digestLength: 3});
      h.update(Buffer.from(code));
      document.orderNo = h.digest("hex")

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
    if (Array.isArray(all))
    {
      for (let data of all){
        data.customer.profile = await this.personsService.fetch(
          data.customer.profile
        )
      }
    }
    else {
      all.customer.profile = await this.personsService.fetch(
        all.customer.profile
      )
    }
    return all
  }

  async getByCustomerId(id: string): Promise<IOrdersInterface[]>{
    return await this.model.find({customer: id}).exec()
  }

  async fetch(id?: string): Promise<IOrdersInterface[] | IOrdersInterface> {
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

  async getByDateRange(min: string, max: string): Promise<IOrdersInterface[]> {
    let all = await this.model
      .find({ createdAt: { $gte: min, $lt: max } })
      .populate('customer')
      .exec()
    all = await this.getPerson(all)
    return all
  }

  async updateStatus(id: string, status: string) {
    return await this.model
      .findByIdAndUpdate(id, { status })
      .populate('customer')
      .exec()
  }

  async getByStatus(status: string) {
    let all = await this.model
      .find({ status })
      .populate('customer')
      .exec()
    all = await this.getPerson(all)
    return all
  }

  async search(query : any){
    let data =  await this.model
      .find({$or: [{'service': { $regex: query.name, $options: "i" }},
          {'status': { $regex: query.name, $options: "i" }},
          {'orderNo': { $regex: query.name, $options: "i" }}
        ], status : 'pending'})
      .populate('customer').exec();

    return await this.getPerson(data)
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
}
