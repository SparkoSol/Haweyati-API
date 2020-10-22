import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service'
import { DriversService } from '../drivers/drivers.service'
import { IOrders } from '../../data/interfaces/orders.interface'
import { CustomersService } from '../customers/customers.service'
import { IDriversInterface } from '../../data/interfaces/drivers.interface'
import { ICustomerInterface } from '../../data/interfaces/customers.interface'
import { ShopRegistrationService } from '../shop-registration/shop-registration.service'
import { IShopRegistration } from '../../data/interfaces/shop-registration.interface'

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
    const suppliers = await this.suppliersService.totalSuppliers()
    const orders = ((await this.ordersService.fetch()) as IOrders[]).length
    const customers = ((await this.customersService.getAll()) as ICustomerInterface[]).length

    let count: number = 0
    const sold = await this.ordersService.fetch() as IOrders[]
    for (const item of sold){
      if (item.service == 'Finishing Material' || item.service == 'Building Material'){
        for (const index of item.items){
          // @ts-ignore
          count += +index.item.qty
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
