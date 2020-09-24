import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import { MulterModule } from '@nestjs/platform-express'
import { CustomersService } from './customers.service';
import { PersonsModule } from '../persons/persons.module';
import { CustomersController } from './customers.controller';
import {CustomersSchema} from "../../data/schemas/customers.schema";
import { AdminNotificationsModule } from '../admin-notifications/admin-notifications.module'

@Module({
  imports: [
    MongooseModule.forFeature([{name:'customers', schema: CustomersSchema}]),
    MulterModule.register({
      dest: '../uploads',
    }),
    PersonsModule,
    AdminNotificationsModule
  ],
  providers: [CustomersService],
  controllers: [CustomersController],
   exports: [CustomersService]
})
export class CustomersModule {}
