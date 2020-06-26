import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {DriversSchema} from "../../data/schemas/drivers.schema";
import { DriverRequestSchema } from '../../data/schemas/driverRequest.schema';

@Module({
  imports: [
     MongooseModule.forFeature([
       {name:'drivers', schema:DriversSchema},
       {name:'driverRequest', schema:DriverRequestSchema}
     ]
    )
  ],
  providers: [DriversService],
  controllers: [DriversController],
  exports: [DriversService]
})
export class DriversModule {}
