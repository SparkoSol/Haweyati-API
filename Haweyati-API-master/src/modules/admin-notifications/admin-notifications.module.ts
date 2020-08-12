import { Module } from '@nestjs/common';
import { AdminNotificationsService } from './admin-notifications.service';
import { AdminNotificationsController } from './admin-notifications.controller';
import { MongooseModule } from '@nestjs/mongoose'
import { AdminNotificationSchema } from '../../data/schemas/adminNotifications.schema'
import { OrdersService } from '../orders/orders.service'
import { AppGateway } from '../../app.gateway'

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'admin-notifications', schema: AdminNotificationSchema}]),
  ],
  providers: [AdminNotificationsService, AppGateway],
  controllers: [AdminNotificationsController],
  exports:[AdminNotificationsService]
})
export class AdminNotificationsModule {}
