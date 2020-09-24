import { Module } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { MongooseModule } from '@nestjs/mongoose'
import { OrdersController } from './orders.controller'
import { MulterModule } from '@nestjs/platform-express'
import { PersonsModule } from '../persons/persons.module'
import { OrdersSchema } from '../../data/schemas/orders.schema'
import { CustomersModule } from '../customers/customers.module'
import { AdminNotificationsModule } from '../admin-notifications/admin-notifications.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'orders', schema: OrdersSchema }]),
    MulterModule.register({
      dest: '../uploads',
    }),
    PersonsModule,
    AdminNotificationsModule,
    CustomersModule
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService]
})
export class OrdersModule {}
