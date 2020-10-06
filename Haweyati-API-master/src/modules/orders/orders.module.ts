import { Module } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { MongooseModule } from '@nestjs/mongoose'
import { OrdersController } from './orders.controller'
import { MulterModule } from '@nestjs/platform-express'
import { PersonsModule } from '../persons/persons.module'
import { OrdersSchema } from '../../data/schemas/orders.schema'
import { CustomersModule } from '../customers/customers.module'
import { AdminNotificationsModule } from '../admin-notifications/admin-notifications.module'
import { FcmModule } from '../fcm/fcm.module'
import { DriversModule } from '../drivers/drivers.module'
import { ShopRegistrationModule } from '../shop-registration/shop-registration.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'orders', schema: OrdersSchema }]),
    MulterModule.register({
      dest: '../uploads',
    }),
    FcmModule,
    PersonsModule,
    CustomersModule,
    DriversModule,
    ShopRegistrationModule,
    AdminNotificationsModule
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService]
})
export class OrdersModule {}
