import { Module } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { OrdersSchema } from '../../data/schemas/orders.schema'
import { PersonsModule } from '../persons/persons.module'
import { MulterModule } from '@nestjs/platform-express'
import { AdminNotificationsModule } from '../admin-notifications/admin-notifications.module'
import { CustomersModule } from '../customers/customers.module'

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
