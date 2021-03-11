import {
  Get,
  Body,
  Post,
  Param,
  Patch,
  Query,
  Controller,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { OrdersService } from './orders.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { SimpleController } from '../../common/lib/simple.controller'
import { IOrder, OrderStatus } from '../../data/interfaces/orders.interface'

@Controller('orders')
export class OrdersController extends SimpleController<IOrder> {
  constructor(protected readonly service: OrdersService) {
    super(service)
  }

  @Get('getbycustomer/:id')
  async getByCustomerId(@Param('id') id: string): Promise<IOrder[]> {
    return await this.service.getByCustomerId(id)
  }

  //deprecated
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  postOverride(@UploadedFile() file, @Body() data: any): Promise<IOrder> {
    data.dropoff = {
      dropoffLocation: {
        longitude: data.longitude,
        latitude: data.latitude
      },
      dropoffAddress: data.dropoffAddress,
      dropoffDate: data.dropoffDate,
      dropoffTime: data.dropoffTime
    }
    if (file) {
      data.image = []
      data.image.push({
        name: file.filename,
        path: file.path,
        sort: 'delivery location'
      })
    }
    return super.post(data)
  }

  @Get('dummy')
  async dummyGet(@Query() data: any): Promise<IOrder[]> {
    if (data.name) {
      return await this.service.getSearchByCustomerId(data.customer, data.name)
    } else return await this.service.getSearchByCustomerId(data.customer)
  }

  @Post('dummy')
  async dummyPost(@Body() data: any): Promise<IOrder> {
    data.city = data.dropoff.city
    return await this.service.create(data)
  }

  @Patch('add-image')
  @UseInterceptors(FileInterceptor('image'))
  async addImage(@UploadedFile() file, @Body() data: any): Promise<IOrder> {
    if (file) {
      data.image = {
        name: file.filename,
        path: file.path,
        sort: data.sort
      }
    }
    return await this.service.addImage(data)
  }

  @Get('search')
  async search(@Query() query: string): Promise<IOrder[]> {
    return await this.service.search(query)
  }

  @Post('view')
  async viewOrders(@Body() data: any): Promise<IOrder[]> {
    return await this.service.viewOrders(data)
  }

  //Order Progress Update
  @Patch('add-supplier-all')
  async AddSupplierToAllItem(@Body() data: any): Promise<IOrder> {
    return await this.service.AddSupplierToOrder(data)
  }

  @Patch('add-driver')
  async AddDriver(@Body() data: any): Promise<IOrder> {
    return await this.service.AddDriver(data)
  }

  @Patch('process-payment')
  async processPayment(@Body() data): Promise<IOrder>{
    return await this.service.processPayment(data)
  }

  @Get('selected-supplier/:id')
  async getBySupplierId(@Param('id') id: string): Promise<IOrder[]> {
    return await this.service.getBySupplierId(id)
  }

  @Get('assigned-supplier/:id')
  async getAssignedOrdersBySupplierId(@Param('id') id: string): Promise<IOrder[]> {
    return await this.service.getAssignedOrdersBySupplierId(id)
  }

  @Get('supplier-status/:id/:status')
  async getOrdersBySupplierAndStatus(@Param('id') id: string, @Param('status') status: number): Promise<IOrder[]> {
    return await this.service.getOrdersBySupplierAndStatus(id, status)
  }

  @Get('driver-status/:id/:status')
  async getOrdersByDriverAndStatus(@Param('id') id: string, @Param('status') status: number): Promise<IOrder[]> {
    return await this.service.getOrdersByDriverAndStatus(id, status)
  }

  @Get('driver/:id')
  async getByDriverId(@Param('id') id: string): Promise<IOrder[]> {
    return await this.service.getByDriverId(id)
  }

  @Get('filter')
  async filter(@Query() data: any): Promise<IOrder[]> {
    return await this.service.filter(data)
  }

  @Patch('update-order-status')
  async updateOrderStatus(@Body() data: any): Promise<IOrder> {
    return await this.service.updateStatus(data._id, this.getStatusFromIndex(data.status))
  }

  getStatusFromIndex(index: number): OrderStatus{
    switch (index){
      case 0:
        return OrderStatus.Pending
      case 1:
        return OrderStatus.Accepted
      case 2:
        return OrderStatus.Preparing
      case 3:
        return OrderStatus.Dispatched
      case 4:
        return OrderStatus.Delivered
      case 5:
        return OrderStatus.Rejected
      case 6:
        return OrderStatus.Cancelled
    }
  }
  
  //-------------------- pending - accepted routes ----------------------

  @Get('getpending')
  async getPendingOrders(): Promise<IOrder[]> {
    return await this.service.getByStatus(OrderStatus.Pending)
  }

  @Get('getactive')
  async getActiveOrders(): Promise<IOrder[]> {
    return await this.service.getByStatus(OrderStatus.Accepted)
  }

  //-------------------- Rejected routes ----------------------

  @Get('getrejected')
  async getRejectedOrders(): Promise<IOrder[]> {
    return await this.service.getByStatus(OrderStatus.Rejected)
  }

  @Patch('getrejected/:id')
  async getRejected(@Param('id') id: string, @Body() data: any): Promise<IOrder> {
    if (data.message)
      return await this.service.updateStatus(id, OrderStatus.Rejected, data.message)
    else
      return await this.service.updateStatus(id, OrderStatus.Rejected)
  }

  //-------------------- Completed routes ----------------------

  @Get('getclosed')
  async getClosedOrders(): Promise<IOrder[]> {
    return await this.service.getByStatus(OrderStatus.Delivered)
  }

  @Patch('getclosed/:id')
  async getClosed(@Param('id') id: string): Promise<IOrder> {
    return this.service.updateStatus(id, OrderStatus.Delivered)
  }

  //-------------------- Approved routes ----------------------

  @Patch('approved/:id')
  async approve_order(@Param('id') id: string): Promise<IOrder> {
    return await this.service.updateStatus(id, OrderStatus.Pending)
  }

  @Patch('cancel/:id')
  async cancel_order(@Param('id') id: string): Promise<IOrder> {
    return await this.service.updateStatus(id, OrderStatus.Cancelled)
  }

  //-------------------- Completed routes ----------------------

  @Get('completed-supplier/:id')
  async completedSupplierId(@Param('id') id: string): Promise<IOrder[]> {
    return await this.service.completedSupplierId(id)
  }

  @Get('completed-driver/:id')
  async completedDriverId(@Param('id') id: string): Promise<IOrder[]> {
    return await this.service.completedDriverId(id)
  }

  @Get('completed')
  async completed(): Promise<IOrder[]> {
    return await this.service.getByStatus(OrderStatus.Delivered)
  }

  //-------------------- Dispatched routes ----------------------

  @Get('dispatched-supplier/:id')
  async dispatchedSupplier(@Param('id') id: string): Promise<IOrder[]> {
    return await this.service.dispatchedSupplier(id)
  }

  @Get('dispatched-driver/:id')
  async dispatchedDriver(@Param('id') id: string): Promise<IOrder[]> {
    return await this.service.dispatchedDriver(id)
  }

  @Get('dispatched')
  async dispatched(): Promise<IOrder[]> {
    return await this.service.getByStatus(OrderStatus.Dispatched)
  }

  //-------------------- Preparing routes ----------------------

  @Get('preparing-driver/:id')
  async preparingSupplier(@Param('id') id: string): Promise<IOrder[]> {
    return await this.service.preparingDriver(id)
  }

  @Get('preparing')
  async preparing(): Promise<IOrder[]> {
    return await this.service.getByStatus(OrderStatus.Preparing)
  }

  @Get('cancelled')
  async cancelled(): Promise<IOrder[]> {
    return await this.service.getByStatus(OrderStatus.Cancelled)
  }

  @Get('driver/new/:city')
  async getDriverOrdersFromCity(@Param('city') city: string): Promise<IOrder[]>{
    return await this.service.getDriverOrdersFromCity(city);
  }

  //Estimating Distance and price for Delivery Vehicles
  @Post('estimate-price')
  async estimateDistanceAndPrice(@Body() data: any): Promise<any>{
    return await this.service.estimateDistanceAndPrice(data)
  }

  @Get('driver/volumetric-weight/:city/:driver')
  async ordersFromVolumetricWeight(@Param('city') city: string, @Param('driver') driver: string): Promise<IOrder[]>{
    return this.service.ordersFromVolumetricWeight(city, driver)
  }

  @Patch('select-items')
  async acceptItems(@Body() data: any): Promise<IOrder>{
    return await this.service.acceptItems(data)
  }

  @Patch('trip')
  async trip(@Body() data: any): Promise<IOrder>{
    return await this.service.trip(data)
  }

  @Patch('rate')
  async rating(@Body() data: any): Promise<IOrder>{
    return await this.service.rating(data)
  }
}
