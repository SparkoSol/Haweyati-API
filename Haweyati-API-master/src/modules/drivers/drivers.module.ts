import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {DriversSchema} from "../../data/schemas/drivers.schema";
import { DriverRequestSchema } from '../../data/schemas/driverRequest.schema';
import { PersonsModule } from '../persons/persons.module';
import { AdminNotificationsModule } from '../admin-notifications/admin-notifications.module'
import { MulterModule } from '@nestjs/platform-express'

@Module({
  imports: [
     MongooseModule.forFeature([
       {name:'drivers', schema:DriversSchema},
       {name:'driverRequest', schema:DriverRequestSchema}
     ]
    ),
    MulterModule.register({
      dest: '../uploads'
    }),
     PersonsModule,
    AdminNotificationsModule
  ],
  providers: [DriversService],
  controllers: [DriversController],
  exports: [DriversService]
})
export class DriversModule {}
