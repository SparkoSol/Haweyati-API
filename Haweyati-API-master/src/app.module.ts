import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { DbModule } from './common/db/db.module'
import { FcmModule } from './modules/fcm/fcm.module'
import { AuthModule } from './common/auth/auth.module'
import { UnitModule } from './modules/unit/unit.module'
import { CityModule } from './modules/city/city.module'
import { OrdersModule } from './modules/orders/orders.module'
import { PersonsModule } from './modules/persons/persons.module'
import { DriversModule } from './modules/drivers/drivers.module'
import { ReportsModule } from './modules/reports/reports.module'
import { CouponsModule } from "./modules/coupons/coupons.module"
import { ReviewsModule } from "./modules/reviews/reviews.module"
import { DumpstersModule } from './modules/dumpsters/dumpsters.module'
import { CustomersModule } from './modules/customers/customers.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'
import { TimeSlotsModule } from './modules/time-slots/time-slots.module'
import { ScaffoldingModule } from './modules/scaffoldings/scaffolding.module'
import { VehicleTypeModule } from './modules/vehicle-type/vehicle-type.module'
import { ServiceRequestsModule } from './modules/service-requests/service-requests.module'
import { BuildingMaterialsModule } from './modules/building-materials/building-materials.module'
import { FinishingMaterialsModule } from './modules/finishing-materials/finishing-materials.module'
import { AdminNotificationsModule } from './modules/admin-notifications/admin-notifications.module'
import { BuildingMaterialCategoryModule } from './modules/building-material-category/building-material-category.module'
import { FinishingMaterialCategoryModule } from './modules/finishing-material-category/finishing-material-category.module'
import { BuildingMaterialSubCategoryModule } from './modules/building-material-sub-category/building-material-sub-category.module'

@Module({
  imports: [
    DbModule,
    FcmModule,
    AuthModule,
    CityModule,
    UnitModule,
    OrdersModule,
    ReportsModule,
    PersonsModule,
    CouponsModule,
    DriversModule,
    ReviewsModule,
    DumpstersModule,
    TimeSlotsModule,
    DashboardModule,
    CustomersModule,
    VehicleTypeModule,
    ScaffoldingModule,
    ServiceRequestsModule,
    BuildingMaterialsModule,
    AdminNotificationsModule,
    FinishingMaterialsModule,
    BuildingMaterialCategoryModule,
    FinishingMaterialCategoryModule,
    BuildingMaterialSubCategoryModule
  ],
  controllers: [AppController]
})
export class AppModule {}
