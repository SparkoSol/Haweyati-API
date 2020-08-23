import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service'
import { ReportUtils } from '../../common/lib/report-utils'

@Injectable()
export class ReportsService {
  constructor(
    private readonly ordersService: OrdersService
  ) {}

  async getOrdersData(data: any){
    switch (data.type) {
      case 'all':
        return await this.ordersService.getByStatus('completed')
      case 'daily':
        return await this.ordersService.getByDate(data.date)
      case 'weekly':
        return await this.ordersService.getByWeek(data.date)
      case 'monthly':
        return await this.ordersService.getByMonth(data.date)
      case 'yearly':
        return await this.ordersService.getByYear(data.date)
      case 'custom':
        return await this.ordersService.getCustom(data.date, data.dateTo)
    }
  }

  async generateReport(data: any){
    console.log(data)
    console.log(await this.getOrdersData(data))
    return ReportUtils.renderReport('SupplierReport.odt', await this.getOrdersData(data))
  }
}
