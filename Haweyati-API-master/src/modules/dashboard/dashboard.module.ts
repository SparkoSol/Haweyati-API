import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DriversModule } from '../drivers/drivers.module'
import { ShopRegistrationModule } from '../shop-registration/shop-registration.module'
import { OrdersModule } from '../orders/orders.module'
import { CustomersModule } from '../customers/customers.module'

@Module({
  imports: [
    DriversModule,
    ShopRegistrationModule,
    OrdersModule,
    CustomersModule
  ],
  providers: [DashboardService],
  controllers: [DashboardController]
})
export class DashboardModule {}
