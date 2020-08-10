import { Module } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { OrdersSchema } from '../../data/schemas/orders.schema'
import { PersonsModule } from '../persons/persons.module'
import { MulterModule } from '@nestjs/platform-express'
import { AppGateway } from '../../app.gateway'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'orders', schema: OrdersSchema }]),
    MulterModule.register({
      dest: '../uploads',
    }),
    PersonsModule
  ],
  providers: [OrdersService, AppGateway],
  controllers: [OrdersController],
  exports: [OrdersService]
})
export class OrdersModule {}
