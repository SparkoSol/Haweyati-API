import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post, Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { SimpleController } from '../../common/lib/simple.controller'
import { IOrdersInterface } from '../../data/interfaces/orders.interface'
import { OrdersService } from './orders.service'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('orders')
export class OrdersController extends SimpleController<IOrdersInterface> {
  constructor(
    protected readonly service: OrdersService
  )
  {
    super(service)
  }

  @Get('getbycustomer/:id')
  async getByCustomerId(@Param('id') id: string): Promise<IOrdersInterface[]>{
    return await this.service.getByCustomerId(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  postOverride(
    @UploadedFile() file,
    @Body() data: any
  ): Promise<IOrdersInterface> {
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
    return super.post(data)
  }

  @Get('range')
  async getByDateRange(@Body() data: any): Promise<IOrdersInterface[]> {
    return await this.service.getByDateRange(data.min, data.max)
  }

  @Get('range/:date')
  async getByDate(@Body() data: any): Promise<IOrdersInterface[]> {
    return await this.service.getByDateRange(data.min, data.max)
  }

  @Get('getpending')
  async getPendingOrders(): Promise<IOrdersInterface[]> {
    return await this.service.getByStatus('pending')
  }

  @Get('getactive')
  async getActiveOrders(): Promise<IOrdersInterface[]> {
    return await this.service.getByStatus('active')
  }

  @Patch('getactive/:id')
  async getActive(@Param('id') id: string): Promise<any> {
    return await this.service.updateStatus(id, 'active')
  }

  @Get('getrejected')
  async getRejectedOrders(): Promise<IOrdersInterface[]> {
    return await this.service.getByStatus('rejected')
  }

  @Patch('getrejected/:id')
  async getRejected(@Param('id') id: string): Promise<any> {
    return await this.service.updateStatus(id, 'rejected')
  }

  @Get('getclosed')
  async getClosedOrders(): Promise<IOrdersInterface[]> {
    return await this.service.getByStatus('closed')
  }

  @Patch('getclosed/:id')
  async getClosed(@Param('id') id: string): Promise<any> {
    return this.service.updateStatus(id, 'closed')
  }

  @Get('search')
  async search(@Query() query:string){
    return await this.service.search(query)
  }

  @Post('view')
  async viewOrders(@Body() data: any): Promise<any>{
    return await this.service.viewOrders(data);
  }
}