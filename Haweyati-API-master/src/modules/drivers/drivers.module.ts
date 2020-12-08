import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { DriversService } from './drivers.service';
import { MulterModule } from '@nestjs/platform-express'
import { DriversController } from './drivers.controller';
import { PersonsModule } from '../persons/persons.module';
import { DriversSchema } from "../../data/schemas/drivers.schema";
import { VehicleTypeModule } from "../vehicle-type/vehicle-type.module";
import { DriverRequestSchema } from '../../data/schemas/driverRequest.schema'
import { ImageConversionUtils } from '../../common/lib/image-conversion-utils'
import { AdminNotificationsModule } from '../admin-notifications/admin-notifications.module'

@Module({
  imports: [
     MongooseModule.forFeature([
       {name:'drivers', schema:DriversSchema},
       {name:'driverRequest', schema:DriverRequestSchema}
     ]
    ),
    MulterModule.register({
      dest: ImageConversionUtils.imagePath
    }),
    PersonsModule,
    VehicleTypeModule,
    AdminNotificationsModule
  ],
  providers: [DriversService],
  controllers: [DriversController],
  exports: [DriversService]
})
export class DriversModule {}
