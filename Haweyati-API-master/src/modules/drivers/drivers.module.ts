import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { DriversService } from './drivers.service';
import { MulterModule } from '@nestjs/platform-express'
import { DriversController } from './drivers.controller';
import { PersonsModule } from '../persons/persons.module';
import { DriversSchema } from "../../data/schemas/drivers.schema";
import { DriverRequestSchema } from '../../data/schemas/driverRequest.schema';
import { AdminNotificationsModule } from '../admin-notifications/admin-notifications.module'

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
