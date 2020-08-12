import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {DriversSchema} from "../../data/schemas/drivers.schema";
import { DriverRequestSchema } from '../../data/schemas/driverRequest.schema';
import { PersonsModule } from '../persons/persons.module';
import { RejectedDriversSchema } from "../../data/schemas/rejectedDrivers.schema";
import { AdminNotificationsModule } from '../admin-notifications/admin-notifications.module'

@Module({
  imports: [
     MongooseModule.forFeature([
       {name:'drivers', schema:DriversSchema},
       {name:'driverRequest', schema:DriverRequestSchema},
        {name: 'driverRejection', schema: RejectedDriversSchema}
     ]
    ),
     PersonsModule,
    AdminNotificationsModule
  ],
  providers: [DriversService],
  controllers: [DriversController],
  exports: [DriversService]
})
export class DriversModule {}
