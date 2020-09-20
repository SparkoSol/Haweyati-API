import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { DbModule } from './common/db/db.module'
import { FcmModule } from './modules/fcm/fcm.module'
import { AuthModule } from './common/auth/auth.module'
import { OrdersModule } from './modules/orders/orders.module'
import { PersonsModule } from './modules/persons/persons.module'
import { DriversModule } from './modules/drivers/drivers.module'
import { ReportsModule } from './modules/reports/reports.module'
import { DumpstersModule } from './modules/dumpsters/dumpsters.module'
import { CustomersModule } from './modules/customers/customers.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'
import { TimeSlotsModule } from './modules/time-slots/time-slots.module'
import { ScaffoldingsModule } from './modules/scaffoldings/scaffoldings.module'
import { ServiceRequestsModule } from './modules/service-requests/service-requests.module'
import { BuildingMaterialsModule } from './modules/building-materials/building-materials.module'
import { FinishingMaterialsModule } from './modules/finishing-materials/finishing-materials.module'
import { AdminNotificationsModule } from './modules/admin-notifications/admin-notifications.module'
import { BuildingMaterialCategoryModule } from './modules/building-material-category/building-material-category.module'
import { FinishingMaterialCategoryModule } from './modules/finishing-material-category/finishing-material-category.module'

@Module({
  imports: [
    DbModule,
    FcmModule,
    AuthModule,
    OrdersModule,
    ReportsModule,
    PersonsModule,
    DriversModule,
    DumpstersModule,
    TimeSlotsModule,
    DashboardModule,
    CustomersModule,
    ScaffoldingsModule,
    ServiceRequestsModule,
    BuildingMaterialsModule,
    AdminNotificationsModule,
    FinishingMaterialsModule,
    BuildingMaterialCategoryModule,
    FinishingMaterialCategoryModule,
  ],
  controllers: [AppController]
})
export class AppModule {}
