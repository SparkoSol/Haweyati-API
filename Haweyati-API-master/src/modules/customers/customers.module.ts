import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {CustomersSchema} from "../../data/schemas/customers.schema";
import { PersonsModule } from '../persons/persons.module';
import { AdminNotificationsModule } from '../admin-notifications/admin-notifications.module'

@Module({
  imports: [
     MongooseModule.forFeature([{name:'customers', schema: CustomersSchema}]),
     PersonsModule,
    AdminNotificationsModule
  ],
  providers: [CustomersService],
  controllers: [CustomersController],
   exports: [CustomersService]
})
export class CustomersModule {}
