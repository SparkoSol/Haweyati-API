import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { SimpleController } from '../../common/lib/simple.controller'
import { IOrdersInterface } from '../../data/interfaces/orders.interface'
import { OrdersService } from './orders.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { ExtractJwt } from 'passport-jwt'
import fromAuthHeaderWithScheme = ExtractJwt.fromAuthHeaderWithScheme

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
}
