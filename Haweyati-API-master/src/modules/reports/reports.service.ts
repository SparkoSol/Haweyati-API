import * as moment from 'moment'
import { OrdersService } from '../orders/orders.service'
import { ReportUtils } from '../../common/lib/report-utils'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { IOrder, OrderStatus } from '../../data/interfaces/orders.interface'

@Injectable()
export class ReportsService {
  constructor(private readonly ordersService: OrdersService) {}

  async getOrdersData(data: any): Promise<IOrder[]>{
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
      date: ReportsService.subTitle(data),
      orders: orders,
      total: total.toFixed(2)
    }
    return ReportUtils.renderReport('order_report', dataForReport)
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

  async generateOrderInvoice(id: string): Promise<any> {
    const order = await this.ordersService.fetch(id) as IOrder
    if (order.status == OrderStatus.Delivered){
      let subtotal = 0
      for (const item of order.items)
        subtotal += +item.subtotal

      const variants = []

      if (order.service == 'Finishing Material') {
        for (const item of order.items) {
          const values = []

          // @ts-ignore
          delete item.item.variants['price']
          // @ts-ignore
          delete item.item.variants['volumetricWeight']
          // @ts-ignore
          delete item.item.variants['cbmLength']
          // @ts-ignore
          delete item.item.variants['cbmHeight']
          // @ts-ignore
          delete item.item.variants['cbmWidth']

          // @ts-ignore
          for (const i in item.item.variants) {
            // @ts-ignore
            values.push(item.item.variants[i])
          }

          if (values.length == 0)
            variants.push({
              values: ''
            })
          else
            variants.push({
              values: values.join(' - ').toString()
            })
        }
      }
      else if (order.service == 'Delivery Vehicle'){
        for (const item of order.items) {
          variants.push({
            // @ts-ignore
            values: item.item.distance.toString() + ' KM'
          })
        }
      }
      else {
        for (const item of order.items) {
          variants.push({
            values: ''
          })
        }
      }

      const dataForReport = {
        subtotal,
        order,
        variants,
      }

      return ReportUtils.renderReport('order_invoice', dataForReport)
    }
    else throw new HttpException(
      'Order is not completed yet!',
      HttpStatus.NOT_ACCEPTABLE
    )
  }
}