import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { SimpleController } from '../../common/lib/simple.controller'
import { IOrders, OrderStatus } from '../../data/interfaces/orders.interface'
import { OrdersService } from './orders.service'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('orders')
export class OrdersController extends SimpleController<IOrders> {
  constructor(
    protected readonly service: OrdersService
  )
  {
    super(service)
  }

  @Get('getbycustomer/:id')
  async getByCustomerId(@Param('id') id: string): Promise<IOrders[]>{
    return await this.service.getByCustomerId(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  postOverride(
    @UploadedFile() file,
    @Body() data: any
  ): Promise<IOrders> {
    data.dropoff = {
      dropoffLocation: {
        longitude: data.longitude,
        latitude: data.latitude
      },
      dropoffAddress: data.dropoffAddress,
      dropoffDate: data.dropoffDate,
      dropoffTime: data.dropoffTime
    }
    if (file){
      data.image = []
      data.image.push({
        name : file.filename,
        path: file.path,
        sort: 'delivery location'
      })
    }
    console.log(data)
    return super.post(data)
  }

  @Get('getpending')
  async getPendingOrders(): Promise<IOrders[]> {
    return await this.service.getByStatus(OrderStatus.Pending)
  }

  @Get('getactive')
  async getActiveOrders(): Promise<IOrders[]> {
    return await this.service.getByStatus(OrderStatus.Active)
  }

  @Patch('getactive/:id')
  async getActive(@Param('id') id: string): Promise<any> {
    return await this.service.updateStatus(id, OrderStatus.Active)
  }

  @Get('getrejected')
  async getRejectedOrders(): Promise<IOrders[]> {
    return await this.service.getByStatus(OrderStatus.Rejected)
  }

  @Patch('getrejected/:id')
  async getRejected(@Param('id') id: string): Promise<any> {
    return await this.service.updateStatus(id, OrderStatus.Rejected)
  }

  @Get('getclosed')
  async getClosedOrders(): Promise<IOrders[]> {
    return await this.service.getByStatus(OrderStatus.Closed)
  }

  @Patch('getclosed/:id')
  async getClosed(@Param('id') id: string): Promise<any> {
    return this.service.updateStatus(id, OrderStatus.Closed)
  }

  @Get('search')
  async search(@Query() query:string){
    return await this.service.search(query)
  }

  @Post('view')
  async viewOrders(@Body() data: any): Promise<any>{
    return await this.service.viewOrders(data);
  }

  //Order Progress Update
  @Patch('add-supplier')
  async AddSupplierToItem(@Body() data: any): Promise<any>{
    return await this.service.AddSupplierToItem(data)
  }

  @Get('supplier/:id')
  async getBySupplierId(@Param('id') id: string): Promise<any>{
    return await this.service.getBySupplierId(id)
  }
}