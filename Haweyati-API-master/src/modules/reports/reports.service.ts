import * as moment from 'moment'
import { Injectable } from '@nestjs/common'
import { OrdersService } from '../orders/orders.service'
import { ReportUtils } from '../../common/lib/report-utils'
import { OrderStatus } from '../../data/interfaces/orders.interface'

@Injectable()
export class ReportsService {
  constructor(private readonly ordersService: OrdersService) {}

  async getOrdersData(data: any) {
    switch (data.type) {
      case 'all':
        return await this.ordersService.getByStatus(OrderStatus.Delivered)
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

  async generateOrdersReport(data: any) {
    const orders = await this.getOrdersData(data)
    let total = 0
    for (let order of orders) {
      order.orderDate = moment(order.updatedAt).format('MM-DD-YYYY')
      total += +order.total
    }
    const dateTo = data.dateTo ? ' - ' + data.dateTo : ''
    const date = data.date ? data.date : ''
    const dataForReport = {
      title: data.type[0].toUpperCase() + data.type.slice(1),
      create: moment().format('MM-DD-YYYY'),
      date: date + dateTo,
      orders: orders,
      total: total
    }
    return ReportUtils.renderReport('order_report.odt', dataForReport)
  }

  async getSalesData(data) {
    switch (data.type) {
      case 'product':
      // return await this.ordersService.getByProduct(data.date, data.dateTo)
      case 'supplier':
        return
      case 'all':
        return
    }
  }
}
