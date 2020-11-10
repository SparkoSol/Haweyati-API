import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { MulterModule } from '@nestjs/platform-express'
import { PersonsModule } from '../persons/persons.module'
import { ServiceRequestsService } from './service-requests.service';
import { ServiceRequestsController } from './service-requests.controller';
import { ServicesRequestsSchema } from "../../data/schemas/serviceRequests.schema";
import { AdminNotificationsModule } from '../admin-notifications/admin-notifications.module'
import { ImageConversionUtils } from '../../common/lib/image-conversion-utils'

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'servicerequests', schema : ServicesRequestsSchema}
      ]),
    MulterModule.register({
      dest: ImageConversionUtils.imagePath
    }),
    PersonsModule,
    AdminNotificationsModule
  ],
  providers: [ServiceRequestsService],
  controllers: [ServiceRequestsController],
  exports : [ServiceRequestsService]
})
export class ServiceRequestsModule {}
