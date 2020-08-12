import { Module } from '@nestjs/common';
import { ServiceRequestsService } from './service-requests.service';
import { ServiceRequestsController } from './service-requests.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { ServicesRequestsSchema } from "../../data/schemas/serviceRequests.schema";
import { PersonsModule } from '../persons/persons.module'
import { AdminNotificationsModule } from '../admin-notifications/admin-notifications.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'servicerequests', schema : ServicesRequestsSchema}
      ]),
    PersonsModule,
    AdminNotificationsModule
  ],
  providers: [ServiceRequestsService],
  controllers: [ServiceRequestsController],
  exports : [ServiceRequestsService]
})
export class ServiceRequestsModule {}
