import {
  Get,
  Res,
  Query,
  Controller, Param
} from "@nestjs/common";
import { ReportsService } from './reports.service'

@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('orders')
  async getOrdersData(@Query() data: any){
    return await this.service.getOrdersData(data)
  }

  @Get('orders-report')
  async generateOrdersReport(@Query() data: any, @Res() res){
    ;(await this.service.generateOrdersReport(data)).pipe(res)
  }

  @Get('order-invoice/:id')
  async generateCustomerInvoice(@Param('id') id: string, @Res() res){
    ;(await this.service.generateOrderInvoice(id)).pipe(res)
  }
}
