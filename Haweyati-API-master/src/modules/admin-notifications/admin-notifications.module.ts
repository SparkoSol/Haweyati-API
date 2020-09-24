import { Module } from '@nestjs/common';
import { AppGateway } from '../../app.gateway'
import { MongooseModule } from '@nestjs/mongoose'
import { AdminNotificationsService } from './admin-notifications.service';
import { AdminNotificationsController } from './admin-notifications.controller';
import { AdminNotificationSchema } from '../../data/schemas/adminNotifications.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'admin-notifications', schema: AdminNotificationSchema}]),
  ],
  providers: [AdminNotificationsService, AppGateway],
  controllers: [AdminNotificationsController],
  exports:[AdminNotificationsService]
})
export class AdminNotificationsModule {}
