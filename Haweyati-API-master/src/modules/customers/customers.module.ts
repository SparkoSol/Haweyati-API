import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { CustomersService } from './customers.service'
import { MulterModule } from '@nestjs/platform-express'
import { PersonsModule } from '../persons/persons.module'
import { CustomersController } from './customers.controller'
import { CustomersSchema } from "../../data/schemas/customers.schema"
import { AdminNotificationsModule } from '../admin-notifications/admin-notifications.module'
import { ImageConversionUtils } from '../../common/lib/image-conversion-utils'

@Module({
  imports: [
    MongooseModule.forFeature([{name:'customers', schema: CustomersSchema}]),
    MulterModule.register({
      dest: ImageConversionUtils.imagePath
    }),
    PersonsModule,
    AdminNotificationsModule
  ],
  providers: [CustomersService],
  controllers: [CustomersController],
   exports: [CustomersService]
})
export class CustomersModule {}
