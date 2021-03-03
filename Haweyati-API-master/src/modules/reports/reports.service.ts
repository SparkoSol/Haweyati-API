import * as moment from 'moment'
import { Injectable } from '@nestjs/common'
import { OrdersService } from '../orders/orders.service'
import { ReportUtils } from '../../common/lib/report-utils'
import { IOrders } from "../../data/interfaces/orders.interface";

@Injectable()
export class ReportsService {
  constructor(private readonly ordersService: OrdersService) {}

  async getOrdersData(data: any): Promise<IOrders[]>{
    return await this.ordersService.ordersAfterFilter(data)
  }

  async generateOrdersReport(data: any): Promise<any> {
    const orders = await this.getOrdersData(data)
    let total = 0
    for (const order of orders) {
      total += order.total
    }

    const dataForReport = {
      title: ReportsService.title(data),
      create: moment().format('YYYY-MM-DD'),
      date: ReportsService.subTitle(data),
      orders: orders,
      total: total.toFixed(0)
    }
    return ReportUtils.renderReport('order_report.odt', dataForReport)
  }

  private static title(data: any): string{
    if (data.date)
      return data.dateTo ? 'Custom' : 'Daily'
    else if (data.week)
      return 'Weekly'
    else if (data.month)
      return 'Monthly'
    else if (data.year)
      return 'Yearly'
    else
      return 'All'
  }

  private static subTitle(data: any): string{
    if (data.date)
      return data.date + (data.dateTo ? (' - ' + data.dateTo) : '')
    else if (data.week)
      return moment(data.week).format('WW of YYYY')
    else if (data.month)
      return moment(data.month).format('MMMM YYYY')
      // return data.month.toString().slice(data.month.toString().length - 2)
    else if (data.year)
      return data.year
    else
      return ''
  }
}
