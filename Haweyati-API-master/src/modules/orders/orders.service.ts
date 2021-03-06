import * as moment from 'moment'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { FcmService } from '../fcm/fcm.service'
import { UnitService } from '../unit/unit.service'
import { PersonsService } from '../persons/persons.service'
import { DriversService } from '../drivers/drivers.service'
import { ReviewsService } from '../reviews/reviews.service'
import { CouponsService } from "../coupons/coupons.service"
import { SimpleService } from '../../common/lib/simple.service'
import { LocationUtils } from '../../common/lib/location-utils'
import { CustomersService } from '../customers/customers.service'
import { IReviews } from '../../data/interfaces/reviews.interface'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { VehicleTypeService } from '../vehicle-type/vehicle-type.service'
import { IVehicleType } from '../../data/interfaces/vehicleType.interface'
import { IDriversInterface } from '../../data/interfaces/drivers.interface'
import { IOrders, OrderStatus } from '../../data/interfaces/orders.interface'
import { ICustomerInterface } from '../../data/interfaces/customers.interface'
import { IShopRegistration } from '../../data/interfaces/shop-registration.interface'
import { ShopRegistrationService } from '../shop-registration/shop-registration.service'
import { AdminNotificationsService } from '../admin-notifications/admin-notifications.service'

@Injectable()
export class OrdersService extends SimpleService<IOrders> {
  constructor(
    @InjectModel('orders')
    protected readonly model: Model<IOrders>,
    protected readonly fcmService: FcmService,
    protected readonly unitService: UnitService,
    protected readonly reviewService: ReviewsService,
    protected readonly driverService: DriversService,
    protected readonly couponService: CouponsService,
    protected readonly personsService: PersonsService,
    protected readonly customersService: CustomersService,
    protected readonly vehicleTypeService: VehicleTypeService,
    protected readonly supplierService: ShopRegistrationService,
    protected readonly adminNotificationsService: AdminNotificationsService
  ) {
    super(model)
  }

  async create(document: IOrders): Promise<any> {
    // @ts-ignore
    if (document.customer.status != 'Blocked') {
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

      const rewardPointsValue = (document.customer as ICustomerInterface).points * await this.unitService.getValue()

      if (document.service == 'Finishing Material'){
        const distance = await LocationUtils.getDistance(
          document.dropoff.dropoffLocation.latitude,
          document.dropoff.dropoffLocation.longitude,
          // @ts-ignore
          document.supplier.location.latitude,
          // @ts-ignore
          document.supplier.location.longitude
        )
        let volumetricWeight = 0
        let cbm = 0

        let check = false;
        for (const item of document.items){
          // @ts-ignore
          if (item.item.varients){
            check = true
            break
          }
        }

        if (check){
          for (const item of document.items){
            // @ts-ignore
            volumetricWeight += (item.item.variants.volumetricWeight * item.item.qty)
            // @ts-ignore
            cbm += ((item.item.variants.cbmLength * item.item.variants.cbmHeight * item.item.variants.cbmWidth) * item.item.qty)
          }
        } else {
          for (const item of document.items){
            // @ts-ignore
            volumetricWeight += (item.item.product.volumetricWeight * item.item.qty)
            // @ts-ignore
            cbm += ((item.item.product.cbmLength * item.item.product.cbmHeight * item.item.product.cbmWidth) * item.item.qty)
          }
        }

        let rounds = 1
        let vehicle = await this.vehicleTypeService.findClosestVehicle(volumetricWeight, cbm) as IVehicleType
        if (document.service == 'Finishing Material' && !vehicle){
          rounds++
          vehicle = await this.vehicleTypeService.findClosestVehicle(volumetricWeight / rounds, cbm / rounds) as IVehicleType
        }

        if (!vehicle)
        {
          throw new HttpException(
            'No Vehicle present to carry this order.',
            HttpStatus.NOT_ACCEPTABLE
          )
        }

        document.deliveryFee = (distance > vehicle.minDistance ? vehicle.deliveryCharges : vehicle.minDeliveryCharges) * distance * rounds
        document.volumetricWeight = volumetricWeight
        document.cbm = cbm
        document.vehicleRounds = rounds
        document.total += document.deliveryFee
      }

      document.vat = +document.vat.toFixed(2)

      let orderCreated

      if (document.coupon){
        if (await this.couponService.checkCouponValidity(document.coupon, (document.customer as ICustomerInterface)._id)){
          orderCreated = await super.create(document)
        }
        else
          throw new HttpException(
            'Invalid Coupon',
            HttpStatus.NOT_ACCEPTABLE
          )
      }
      else
        orderCreated = await super.create(document)

      //notification for admin
      if (orderCreated) {
        if (document.coupon){
          await this.couponService.addUser(document.coupon, (document.customer as ICustomerInterface)._id)
        }
        else if (document.rewardPointsValue && document.rewardPointsValue != 0)
          if (rewardPointsValue >= document.rewardPointsValue){
            const usedPoints = document.rewardPointsValue / await this.unitService.getValue()
            await this.customersService.updatePointsFromId((document.customer as ICustomerInterface)._id, ~~usedPoints, false)
          }
          else
            await this.customersService.updatePointsFromId((document.customer as ICustomerInterface)._id, ~~(orderCreated.total * 0.15), false)

        if (orderCreated.service == 'Finishing Material'){
          this.fcmService.sendSingle({
            // @ts-ignore
            id: orderCreated.supplier.person._id,
            title: 'You have been assigned an order.',
            body: 'Order #' + orderCreated.orderNo
          })
        }

        const notification = {
          type: 'Order',
          title: 'New Order',
          message: 'New Order with Ref. # ' + orderCreated.orderNo + '.'
        }
        await this.adminNotificationsService.create(notification)

        let data
        const ids = new Set<string>()

        if (orderCreated.service != 'Delivery Vehicle'){
          data = await this.supplierService.getSupplierFromCityName(orderCreated.city, orderCreated.service) as IShopRegistration[]
          for (const item of data){
            if (item.person.token)
              ids.add(item.person.token.toString())
          }
        }
        else{
          data = await this.driverService.getDataFromCityName(orderCreated.city) as IDriversInterface[]
          for (const item of data){
            if (item.profile.token)
              ids.add(item.profile.token?.toString())
          }
        }

        this.fcmService.sendMultiple(Array.from(ids), 'New ' + orderCreated.service + ' order.', 'City: ' + orderCreated.city)

        orderCreated.customer = await this.customersService.fetch(
          // @ts-ignore
          document.customer
        )

        return orderCreated
      }
      else
        throw new HttpException(
          'No vehicle present to carry your order',
          HttpStatus.NOT_ACCEPTABLE
        )
    } else {
      throw new HttpException(
        "You are blocked by Admin! You can't place order, contact Haweyati Support for help.",
        HttpStatus.NOT_ACCEPTABLE
      )
    }
  }

  async addImage(data: any): Promise<IOrders> {
    const order = (await this.model.findById(data.id)) as IOrders
    if (order.image) order.image.push(data.image)
    else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      order.image = [data.image]
    }

    // @ts-ignore
    return (await order.save()).image.name
  }

  async getPerson(all: any): Promise<any> {
    if (Array.isArray(all)) {
      for (const data of all) {
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
    return await this.getPerson(
      await this.model
        .find({ status: OrderStatus.Accepted })
        .where('supplier._id: id')
        .populate('customer')
        .exec()
    )
  }

  async getAssignedOrdersBySupplierId(id: string): Promise<any> {
    const result = new Set()
    const orders = (await this.fetch()) as IOrders[]
    for (const order of orders) {
      for (const one of order.items) {
        // @ts-ignore
        if (one.supplier?._id == id && order.status == OrderStatus.Preparing) {
          result.add(order)
          break
        }
      }
    }
    return Array.from(result)
  }

  async getOrdersBySupplierAndStatus(id: string, status: number): Promise<any> {
    return await this.getPerson(
      await this.model
        .find({ status: status })
        .where('supplier._id', id)
        .populate('customer')
        .sort({createdAt: -1})
        .exec()
    )
  }

  async getOrdersByDriverAndStatus(id: string, status: number): Promise<any> {
    return await this.getPerson(
      await this.model
        .find({ status: status })
        .where('driver._id', id)
        .populate('customer')
        .sort({createdAt: -1})
        .exec()
    )
  }

  async completedSupplierId(id: string): Promise<any> {
    const result = new Set()
    const orders = (await this.getPerson(
      await this.model
        .find({ status: OrderStatus.Delivered })
        .populate('customer')
        .sort({ createdAt: -1 })
        .exec()
    )) as IOrders[]
    for (const order of orders) {
      for (const one of order.items) {
        // @ts-ignore
        if (one.supplier?._id == id) {
          result.add(order)
        }
      }
    }
    return Array.from(result)
  }

  async dispatchedSupplier(id: string): Promise<any> {
    const result = new Set()
    const orders = (await this.getPerson(
      await this.model
        .find({ status: OrderStatus.Dispatched })
        .populate('customer')
        .sort({ createdAt: -1 })
        .exec()
    )) as IOrders[]
    for (const order of orders) {
      for (const one of order.items) {
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
      const data = await this.model
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

  async getByStatus(status: OrderStatus): Promise<IOrders[]> {
    let all = await this.model
      .find({ status })
      .populate('customer')
      .sort({ createdAt: -1 })
      .exec()
    all = await this.getPerson(all)
    return all
  }

  async updateStatus(id: string, status: OrderStatus, message?: string): Promise<IOrders> {
    const order = await this.model.findByIdAndUpdate(id, { status, reason: message }, {new: true}).exec()

    if (status == OrderStatus.Delivered){
      await this.customersService.updatePointsFromId(order.customer.toString(), ~~(order.total * 0.05), true)

      if (
        await this.model.find({customer: order.customer.toString(), status: OrderStatus.Delivered}).countDocuments().exec() == 1 &&
        (await this.customersService.fetch(order.customer.toString()) as ICustomerInterface).fromReferralCode
      ){
        await this.customersService.updatePointsFromReferral(
          (await this.customersService.fetch(order.customer.toString()) as ICustomerInterface).fromReferralCode, 500, true
        )
      }
    }
    
    const persons = new Set<string>()

    if (order.service != 'Delivery Vehicle'){
      if (order.status == OrderStatus.Delivered){
        if (order.supplier){
          // @ts-ignore
          persons.add(order.supplier.person._id.toString())
        }
      } else {
        if (order.driver) {
          // @ts-ignore
          persons.add(order.driver.profile._id.toString())
        }
      }
    }

    // @ts-ignore
    persons.add(
      (
        await this.customersService.fetch(order.customer.toString())
      ).profile._id.toString()
    )


    const notificationStatus = this.getStatusString(status)

    for (const id of persons) {
      this.fcmService.sendSingle({
        id: id,
        title: status == OrderStatus.Delivered
          ? 'Your order has been delivered!'
          : status == OrderStatus.Dispatched ?
          'Your order has been dispatched!' : 'Order Status Update',
        body:
          status == OrderStatus.Delivered
            ? 'Order #' + order.orderNo
            : status == OrderStatus.Dispatched ?
             'Order #' + order.orderNo
            : 'Your Order Status has been changed to ' +
              notificationStatus +
              ' Order #' +
              order.orderNo
      })
    }
    return order
  }

  getStatusString(status: OrderStatus): string {
    let notificationStatus: string
    switch (status) {
      case OrderStatus.Accepted:
        notificationStatus = 'Accepted'
        break
      case OrderStatus.Delivered:
        notificationStatus = 'Delivered'
        break
      case OrderStatus.Dispatched:
        notificationStatus = 'Dispatched'
        break
      case OrderStatus.Pending:
        notificationStatus = 'Pending'
        break
      case OrderStatus.Preparing:
        notificationStatus = 'Preparing'
        break
      case OrderStatus.Cancelled:
        notificationStatus = 'Cancelled'
        break
      case OrderStatus.Rejected:
        notificationStatus = 'Rejected'
    }

    return notificationStatus
  }

  async search(query: any): Promise<IOrders[]> {
    const data = await this.model
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
    const results = new Set()
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

  async ordersAfterFilter(document: any): Promise<IOrders[]>{
    const condition = {}

    condition['status'] = OrderStatus.Delivered
    if (document){
      if (document.customer) {
        condition['customer'] = document.customer;
      }
      if (document.supplier) {
        condition['supplier._id'] = document.supplier;
      }
      if (document.driver) {
        condition['driver._id'] = document.driver;
      }

      if (document.payment == paymentType.cod){
        condition['paymentType'] = 'COD';
      }
      else if (document.payment == paymentType.op){
        condition['paymentType'] = 'OP';
      }

      if (document.date){
        condition['createdAt'] = {
          $gte: moment(document.date).toDate(),
          $lt: document.dateTo ? moment(document.dateTo).add(1, 'day').toDate() : moment(document.date).add(1, 'day').toDate()
        }
      }

      else if (document.week){
        condition['createdAt'] = {
          $gte: moment(document.week).toDate(),
          $lt: moment(document.week).add(1, 'week').toDate()
        }
      }

      else if (document.month){
        condition['createdAt'] = {
          $gte: moment(document.month).toDate(),
          $lt: moment(document.month).add(1, 'month').toDate()
        }
      }

      else if (document.year){
        condition['createdAt'] = {
          $gte: moment(document.year).toDate(),
          $lt: moment(document.year).add(1, 'year').toDate()
        }
      }
    }

    return await this.model
      .find(
        condition
      )
      .populate({
        path: 'customer',
        model: 'customers',
        populate: {
          path: 'profile',
          model: 'persons'
        }
      })
      .sort({ createdAt: -1 })
      .exec()
  }

  async AddSupplierToOrder(data: any): Promise<any> {
    const order = await this.getPerson(await this.model.findById(data._id).populate('customer').exec()) as IOrders
    if (data.flag) {
      //move these two statement below on your own risk
      if (!order.supplier) order.supplier = data.supplier
      order.status = OrderStatus.Accepted
      if (order.service != 'Construction Dumpster'){
        const distance = await LocationUtils.getDistance(
          order.dropoff.dropoffLocation.latitude,
          order.dropoff.dropoffLocation.longitude,
          // @ts-ignore
          order.supplier.location.latitude,
          // @ts-ignore
          order.supplier.location.longitude
        )
        let volumetricWeight = 0
        let cbm = 0

        if (order.service == 'Building Material'){
          for (const item of order.items){
            // @ts-ignore
            const unit = await this.unitService.findFromName(item.item.price.unit.toString())
            // @ts-ignore
            volumetricWeight += (unit.volumetricWeight * item.item.qty)
            // @ts-ignore
            cbm += ((unit.cbmLength * unit.cbmHeight * unit.cbmWidth) * item.item.qty)
          }
        } else {
          for (const item of order.items){
            // @ts-ignore
            volumetricWeight += (item.item.product.volumetricWeight * item.item.qty)
            // @ts-ignore
            cbm += ((item.item.product.cbmLength * item.item.product.cbmWidth * item.item.product.cbmHeight) * item.item.qty)
          }
        }

        const rounds = 1
        const vehicle = await this.vehicleTypeService.findClosestVehicle(volumetricWeight, cbm) as IVehicleType

        if (!vehicle){
          throw new HttpException(
            'No Vehicle present to carry this order.',
            HttpStatus.NOT_ACCEPTABLE
          )
        }

        order.deliveryFee = vehicle.deliveryCharges * distance * rounds
        order.volumetricWeight = volumetricWeight
        order.cbm = cbm
        order.vehicleRounds = rounds

        let subtotal = 0
        if (order.service == 'Building Material'){
          for (const item of order.items){
            subtotal += +item.subtotal
          }
          subtotal += order.deliveryFee
          order.vat = (subtotal * 0.15)
          order.total = subtotal + order.vat
        }
        else
          order.total += order.deliveryFee
      } else {
        //sending notification to customer
        this.fcmService.sendSingle({
          // @ts-ignore
          id: order.customer.profile._id,
          // @ts-ignore
          title: 'Your order has been accepted by ' + order.supplier.person.name,
          body: order.service == 'Construction Dumpster' ? 'Order #' + order.orderNo :  'Please proceed with payment for Order #' + order.orderNo
        })
      }
    }
    else {
      if (order.service != 'Construction Dumpster' && order.service != 'Delivery Vehicle'){
        order.paymentType = null
        order.deliveryFee = null
      }

      order.supplier = undefined
      order.status = order.service == 'Finishing Material' ? OrderStatus.Rejected : OrderStatus.Pending
      
      if (order.service == 'Building Material') {
        let sub = 0
        for (const item of order.items) {
          sub += +item.subtotal
        }
        order.vat = sub * 0.15
        order.total = sub + order.vat
      }

      order.supplierCancellationReason = {
        supplier: data.supplier._id,
        message: data.reason
      }
      //sending notification to customer
      this.fcmService.sendSingle({
        // @ts-ignore
        id: order.customer.profile._id,
        // @ts-ignore
        title: 'Your order has been cancelled by supplier',
        body: 'Order #' + order.orderNo
      })
    }

    //dont move
    return await order.save()
  }

  async AddDriver(data: any): Promise<any> {
    if (data.flag) {
      const order = await this.getPerson(
        await this.model
        .findById(data._id)
        .populate('customer')
        .exec())
      if (!order.driver) {
        if (order.service == 'Scaffolding' || order.service == 'Building Material') {
          order.driver = data.driver

          order.status = OrderStatus.Preparing
          await order.save()

          // @ts-ignore
          await this.fcmService.sendSingle({
            // @ts-ignore
            id: order.customer.profile._id,
            title:
              'You order has been accepted by driver!',
            body: order.service == 'Scaffolding' ? 'Order #' + order.orderNo : 'Your order is awaiting payment response. Order #' + order.orderNo
          })
          // @ts-ignore
          await this.fcmService.sendSingle({
            // @ts-ignore
            id: order.supplier.person._id,
            title:
              'You order has been accepted by driver!',
            body: 'Order #' + order.orderNo
          })
        } else {
          order.driver = data.driver
          order.status = OrderStatus.Preparing
          await order.save()

          // @ts-ignore
          await this.fcmService.sendSingle({
            id: data.driver.profile._id,
            title: 'You have been assigned an order!',
            body: 'Order #' + order.orderNo
          })
          // @ts-ignore
          await this.fcmService.sendSingle({
            id: order.customer.profile._id,
            title: 'You order has been assigned to a driver',
            body: 'Order #' + order.orderNo
          })
        }
        // this.fcmService.sendSingle({id: order.customer.profile._id, title: "Your order status has been changed to "+ this.getStatusString(OrderStatus.Preparing), body: 'Order # '+ order.orderNo})
      }
      else {
        throw new HttpException(
          'Order Not Available!',
          HttpStatus.NOT_ACCEPTABLE
        )
      }
    }
    else {
      return await this.model
        .findOneAndUpdate(
          { _id: data._id },
          { driver: undefined, status: OrderStatus.Accepted }
        )
        .exec()
    }
  }

  async processPayment(data: any): Promise<IOrders> {
    const order = await this.model
      .findByIdAndUpdate(data._id, {
        paymentType: data.paymentType,
        paymentIntentId: data.paymentIntentId
      })
      .exec()

    // @ts-ignore
    await this.fcmService.sendSingle({
      // @ts-ignore
      id: order.supplier.person._id,
      title:
        'Order #' + order.orderNo + ' payment is confirmed!',
      body: 'Please proceed with the order.'
    })

    if (order.driver){
      // @ts-ignore
      await this.fcmService.sendSingle({
        // @ts-ignore
        id: order.driver.profile._id,
        title:
          'Order #' + order.orderNo + ' payment is confirmed!',
        body: 'Please proceed with the order.'
      })
    }

    const ids = new Set<string>()

    data = await this.driverService.getDataFromCityName(order.city) as IDriversInterface[]
    for (const item of data){
      ids.add(item.profile.token?.toString())
    }

    this.fcmService.sendMultiple(Array.from(ids), 'New ' + order.service + ' order.', 'City: ' + order.city)

    return order
  }

  async filter(data: any): Promise<IOrders[]> {
    const result = new Set<any>()
    const orders = await this.getPerson(
      await this.model
      .find({ city: data.city, status: OrderStatus.Pending, service: {$ne: 'Delivery Vehicle'} })
      .populate('customer')
      .sort({ createdAt: -1 })
      .exec()
    )
    for (const order of orders) {
      if (data.services.includes(order.service)) {
        result.add(order)
      }
    }
    return Array.from(result)
  }

  async getDriverOrdersFromCity(city: string): Promise<IOrders[]> {
    return await this.getPerson(
      await this.model
        .find({ city, service: 'Delivery Vehicle' })
        .populate('customer')
        .sort({ createdAt: -1 })
        .exec()
    )
  }

  async estimateDistanceAndPrice(data: any): Promise<any> {
    const distance = +(await LocationUtils.getDistance(
      data.pickUpLat,
      data.pickUpLng,
      data.dropOffLat,
      data.dropOffLng
    ))
    return {
      distance,
      price:
        distance *
        +((await this.vehicleTypeService.fetch(data.vehicle)) as IVehicleType)
          ?.deliveryCharges
    }
  }

  async ordersFromVolumetricWeight(city: string, driverId: string): Promise<IOrders[]>{
    const driver  = await this.driverService.fetch(driverId) as IDriversInterface

    const orders = (await this.model.find(
      {
        // @ts-ignore
        volumetricWeight: {$lte: driver.vehicle.type.volumetricWeight},
        // @ts-ignore
        cbm: {$lte: (driver.vehicle.type.cbmLength * driver.vehicle.type.cbmWidth * driver.vehicle.type.cbmHeight)},
        driver: {$eq: null},
        paymentType: {$ne: null},
        city,
        service: {$nin: ['Delivery Vehicle', 'Building Material']}
      })
      .populate('customer')
      .sort({createdAt: -1})
      .exec()) as IOrders[]

    // @ts-ignore
    const dvOrders = await this.model
      .find({service: 'Delivery Vehicle', status: OrderStatus.Pending, city})
      .populate('customer')
      .sort({createdAt: -1})
      .exec() as IOrders[]

    const bmOrders = await this.model
      .find({service: 'Building Material', status: OrderStatus.Accepted, city})
      .populate('customer')
      .sort({createdAt: -1})
      .exec() as IOrders[]

    for (const singleOrder of dvOrders){
      // @ts-ignore
      if (singleOrder.items[0].item.product._id == driver.vehicle.type._id){
        orders.push(singleOrder)
      }
    }
    for (const singleOrder of bmOrders){
      orders.push(singleOrder)
    }
    return await this.getPerson(orders)
  }

  async acceptItems(data: any): Promise<IOrders>{
    const order = await this.model.findById(data._id).exec()
    for (const index of data.selected) {
      // @ts-ignore
      order.items[index].item.selected = true
    }
    for (const item of order.items){
      // @ts-ignore
      if (!item.item.selected) {
        // @ts-ignore
        item.item.selected = false;
      }
    }

    /// TODO: Reason not saving

    order.itemReason = data.reason
    order.status = OrderStatus.Accepted
    return await this.model.findByIdAndUpdate(order._id, order).exec()
  }

  async trip(data: any): Promise<IOrders>{
    return await this.model.findByIdAndUpdate(data._id, {tripId: data.tripId, shareUrl: data.shareUrl}).exec()
  }

  async rating(data: any): Promise<IOrders>{
    const order = await this.model.findById(data._id).exec()

    // @ts-ignore
    await this.driverService.updateRating(order.driver._id, data.driverRating)
    if (data.supplierRating){
      // @ts-ignore
      await this.supplierService.updateRating(order.supplier._id, data.supplierRating)
      await this.reviewService.create({
        customer: order.customer.toString(),
        supplier: order.supplier as IShopRegistration,
        driver: order.driver as IDriversInterface,
        order: order,
        supplierFeedback: data.supplierReview,
        driverFeedback: data.driverReview,
        driverRating: data.driverRating,
        supplierRating: data.supplierRating
      } as IReviews)
      return this.model.findByIdAndUpdate(data._id, {rating: ((data.driverRating + data.supplierRating) / 2)}).exec()
    }
    else {
      await this.reviewService.create({
        customer: order.customer.toString(),
        driver: order.driver as IDriversInterface,
        order: order,
        driverFeedback: data.driverReview,
        driverRating: data.driverRating,
      } as IReviews)
      return this.model.findByIdAndUpdate(order._id, {rating: data.driverRating}).exec()
    }
    try {

    } catch (e) {
      throw new HttpException("An unexpected error occurred! try again later or contact customer support.",
        HttpStatus.NOT_ACCEPTABLE)
    }
  }
}

enum paymentType {
  cod = 1,
  op = 2
}