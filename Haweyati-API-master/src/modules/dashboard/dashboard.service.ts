import { Injectable } from '@nestjs/common';
import { DriversService } from '../drivers/drivers.service'
import { IDriversInterface } from '../../data/interfaces/drivers.interface'
import { ShopRegistrationService } from '../shop-registration/shop-registration.service'
import { IShopRegistrationInterface } from '../../data/interfaces/shop-registration.interface'
import { OrdersService } from '../orders/orders.service'
import { IOrdersInterface } from '../../data/interfaces/orders.interface'
import { CustomersService } from '../customers/customers.service'
import { ICustomerInterface } from '../../data/interfaces/customers.interface'

@Injectable()
export class DashboardService {
  constructor(
    protected readonly driversService : DriversService,
    protected readonly suppliersService : ShopRegistrationService,
    protected readonly ordersService : OrdersService,
    protected readonly customersService : CustomersService
  ) {}

  async allData(): Promise<any>{
    const drivers = ((await this.driversService.fetch()) as IDriversInterface[]).length
    const suppliers = ((await this.suppliersService.fetch()) as IShopRegistrationInterface[]).length
    const orders = ((await this.ordersService.fetch()) as IOrdersInterface[]).length
    const customers = ((await this.customersService.getAll()) as ICustomerInterface[]).length

    let count: Number = 0
    const sold = await this.ordersService.fetch() as IOrdersInterface[]
    for (const item of sold){
      if (item.service == 'Finishing Material' || item.service == 'Building Material'){
        for (const index of item.details.items){
          count += index.qty
        }
      }
    }

    return {
      drivers : drivers,
      suppliers : suppliers,
      orders : orders,
      customers : customers,
      productSold : count
    }
  }

}
