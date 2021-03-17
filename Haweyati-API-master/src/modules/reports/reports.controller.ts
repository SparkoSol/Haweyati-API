import { ReportsService } from './reports.service'
import { IOrder } from '../../data/interfaces/orders.interface'
import { Controller, Get, Param, Query, Res } from '@nestjs/common'


@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {
  }

  @Get('orders')
  async getOrdersData(@Query() data: any): Promise<IOrder[]> {
    return await this.service.getOrdersData(data)
  }

  @Get('orders-report')
  async generateOrdersReport(@Query() data: any, @Res() res): Promise<any> {
    ;(await this.service.generateOrdersReport(data)).pipe(res)
  }

  @Get('order-invoice/:id')
  async generateCustomerInvoice(@Param('id') id: string, @Res() res): Promise<any> {
    ;(await this.service.generateOrderInvoice(id)).pipe(res)
  }
}
