import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { SimpleController } from '../../common/lib/simple.controller'
import { IOrdersInterface } from '../../data/interfaces/orders.interface'
import { OrdersService } from './orders.service'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('orders')
export class OrdersController extends SimpleController<IOrdersInterface> {
  constructor(protected readonly service: OrdersService) {
    super(service)
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  postOverride(
    @UploadedFile() file,
    @Body() data: any
  ): Promise<IOrdersInterface> {
    console.log(data)
    data.dropoff = {
      dropoffLocation: {
        longitude: data.longitude,
        latitude: data.latitude
      },
      dropoffAddress: data.dropoffAddress,
      dropoffDate: data.dropoffDate,
      dropoffTime: data.dropoffTime
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
}
