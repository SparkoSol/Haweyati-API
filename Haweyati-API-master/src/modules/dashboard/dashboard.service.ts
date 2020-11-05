import { Injectable } from '@nestjs/common'
import { OrdersService } from '../orders/orders.service'
import { DriversService } from '../drivers/drivers.service'
import { CustomersService } from '../customers/customers.service'
import { IDriversInterface } from '../../data/interfaces/drivers.interface'
import { IOrders, OrderStatus } from '../../data/interfaces/orders.interface'
import { ICustomerInterface } from '../../data/interfaces/customers.interface'
import { ShopRegistrationService } from '../shop-registration/shop-registration.service'
import { BuildingMaterialsService } from '../building-materials/building-materials.service'
import { FinishingMaterialsService } from '../finishing-materials/finishing-materials.service'

@Injectable()
export class DashboardService {
  constructor(
    protected readonly ordersService: OrdersService,
    protected readonly driversService: DriversService,
    protected readonly customersService: CustomersService,
    protected readonly suppliersService: ShopRegistrationService,
    protected readonly buildingMaterialService: BuildingMaterialsService,
    protected readonly finishingMaterialService: FinishingMaterialsService
  ) {}

  async allData(): Promise<any> {
    const drivers = ((await this.driversService.getByStatus(
      'Active'
    )) as IDriversInterface[]).length
    const suppliers = await this.suppliersService.totalSuppliers()
    const orders = ((await this.ordersService.getByStatus(
      OrderStatus.Pending
    )) as IOrders[]).length
    const customers = ((await this.customersService.fetch()) as ICustomerInterface[])
      .length

    let count: number =
      ((await this.buildingMaterialService.fetch()) as []).length +
      ((await this.finishingMaterialService.fetch()) as []).length
    // let count: number = 0
    // const sold = (await this.ordersService.fetch()) as IOrders[]
    // for (const item of sold) {
    //   if (
    //     item.service == 'Finishing Material' ||
    //     item.service == 'Building Material'
    //   ) {
    //     for (const index of item.items) {
    //       // @ts-ignore
    //       count += +index.item.qty
    //     }
    //   }
    // }

    return {
      drivers: drivers,
      suppliers: suppliers,
      orders: orders,
      customers: customers,
      productSold: count
    }
  }
}
