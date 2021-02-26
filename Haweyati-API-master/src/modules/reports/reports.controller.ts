import {
  Get,
  Res,
  Body,
  Post,
  Query,
  Controller
} from '@nestjs/common'
import { ReportsService } from './reports.service'

@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Post('orders')
  async getOrdersData(@Body() data: any){
    return await this.service.getOrdersData(data)
  }

  @Get('orders-report')
  async generateOrdersReport(@Query() data: any, @Res() res){
    ;(await this.service.generateOrdersReport(data)).pipe(res)
  }

  @Post('sales')
  async getSalesData(@Body() data: any) {
    return await this.service.getSalesData(data)
  }
}
