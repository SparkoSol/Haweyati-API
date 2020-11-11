import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { OrdersService } from './orders.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { SimpleController } from '../../common/lib/simple.controller'
import { IOrders, OrderStatus } from '../../data/interfaces/orders.interface'

@Controller('orders')
export class OrdersController extends SimpleController<IOrders> {
  constructor(protected readonly service: OrdersService) {
    super(service)
  }

  @Get('getbycustomer/:id')
  async getByCustomerId(@Param('id') id: string): Promise<IOrders[]> {
    return await this.service.getByCustomerId(id)
  }

  //deprecated
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  postOverride(@UploadedFile() file, @Body() data: any): Promise<IOrders> {
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
  async dummyGet(@Query() data: any): Promise<IOrders[]> {
    if (data.name) {
      return await this.service.getSearchByCustomerId(data.customer, data.name)
    } else return await this.service.getSearchByCustomerId(data.customer)
  }

  @Post('dummy')
  async dummyPost(@Body() data: any): Promise<IOrders> {
    data.city = data.dropoff.city
    return await this.service.create(data)
  }

  @Patch('add-image')
  @UseInterceptors(FileInterceptor('image'))
  async addImage(@UploadedFile() file, @Body() data: any): Promise<IOrders> {
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
  async search(@Query() query: string) {
    return await this.service.search(query)
  }

  @Post('view')
  async viewOrders(@Body() data: any): Promise<any> {
    return await this.service.viewOrders(data)
  }

  //Order Progress Update
  @Patch('add-supplier')
  async AddSupplierToItem(@Body() data: any): Promise<any> {
    return await this.service.AddSupplierToItem(data)
  }

  @Patch('add-driver')
  async AddDriver(@Body() data: any): Promise<any> {
    return await this.service.AddDriver(data)
  }

  @Get('selected-supplier/:id')
  async getBySupplierId(@Param('id') id: string): Promise<any> {
    return await this.service.getBySupplierId(id)
  }

  @Get('driver/:id')
  async getByDriverId(@Param('id') id: string): Promise<IOrders[]> {
    return await this.service.getByDriverId(id)
  }

  @Get('filter')
  async filter(@Query() data: any): Promise<IOrders[]> {
    return await this.service.filter(data)
  }

  @Patch('pickup-update')
  async pickupUpdate(@Body() data: any): Promise<any> {
    return await this.service.pickupUpdate(data)
  }

  //-------------------- pending routes ----------------------

  @Get('getpending')
  async getPendingOrders(): Promise<IOrders[]> {
    return await this.service.getByStatus(OrderStatus.Pending)
  }

  //-------------------- Accepted routes ----------------------

  @Get('getactive')
  async getActiveOrders(): Promise<IOrders[]> {
    return await this.service.getByStatus(OrderStatus.Accepted)
  }

  @Patch('getactive/:id')
  async getActive(@Param('id') id: string): Promise<any> {
    return await this.service.updateStatus(id, OrderStatus.Accepted)
  }

  //-------------------- Rejected routes ----------------------

  @Get('getrejected')
  async getRejectedOrders(): Promise<IOrders[]> {
    return await this.service.getByStatus(OrderStatus.Rejected)
  }

  @Patch('getrejected/:id')
  async getRejected(@Param('id') id: string): Promise<any> {
    return await this.service.updateStatus(id, OrderStatus.Rejected)
  }

  //-------------------- Completed routes ----------------------

  @Get('getclosed')
  async getClosedOrders(): Promise<IOrders[]> {
    return await this.service.getByStatus(OrderStatus.Delivered)
  }

  @Patch('getclosed/:id')
  async getClosed(@Param('id') id: string): Promise<any> {
    return this.service.updateStatus(id, OrderStatus.Delivered)
  }

  //-------------------- Approved routes ----------------------

  @Get('approved')
  async approved(): Promise<IOrders[]> {
    return await this.service.getByStatus(OrderStatus.Approved)
  }

  @Patch('approved/:id')
  async approve_order(@Param('id') id: string): Promise<any> {
    return await this.service.updateStatus(id, OrderStatus.Approved)
  }

  @Patch('cancel/:id')
  async cancel_order(@Param('id') id: string): Promise<any> {
    return await this.service.updateStatus(id, OrderStatus.Cancelled)
  }

  //-------------------- Completed routes ----------------------

  @Get('completed-supplier/:id')
  async completedSupplierId(@Param('id') id: string): Promise<any> {
    return await this.service.completedSupplierId(id)
  }

  @Get('completed-driver/:id')
  async completedDriverId(@Param('id') id: string): Promise<IOrders[]> {
    return await this.service.completedDriverId(id)
  }

  @Get('completed')
  async completed(): Promise<IOrders[]> {
    return await this.service.getByStatus(OrderStatus.Delivered)
  }

  //-------------------- Dispatched routes ----------------------

  @Get('dispatched-supplier/:id')
  async dispatchedSupplier(@Param('id') id: string): Promise<any> {
    return await this.service.dispatchedSupplier(id)
  }

  @Get('dispatched-driver/:id')
  async dispatchedDriver(@Param('id') id: string): Promise<any> {
    return await this.service.dispatchedDriver(id)
  }

  @Get('dispatched')
  async dispatched(): Promise<any> {
    return await this.service.getByStatus(OrderStatus.Dispatched)
  }

  //-------------------- Preparing routes ----------------------

  @Get('preparing-driver/:id')
  async preparingSupplier(@Param('id') id: string): Promise<any> {
    return await this.service.preparingDriver(id)
  }

  @Get('preparing')
  async preparing(): Promise<any> {
    return await this.service.getByStatus(OrderStatus.Preparing)
  }

  @Get('cancelled')
  async cancelled(): Promise<any> {
    return await this.service.getByStatus(OrderStatus.Cancelled)
  }
}
