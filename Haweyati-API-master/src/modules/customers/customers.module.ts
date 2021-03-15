import { Module } from '@nestjs/common'
import { FcmModule } from "../fcm/fcm.module"
import { UnitModule } from "../unit/unit.module"
import { MongooseModule } from "@nestjs/mongoose"
import { CustomersService } from './customers.service'
import { MulterModule } from '@nestjs/platform-express'
import { PersonsModule } from '../persons/persons.module'
import { CustomersController } from './customers.controller'
import { CustomersSchema } from "../../data/schemas/customers.schema"
import { ImageConversionUtils } from '../../common/lib/image-conversion-utils'
import { AdminNotificationsModule } from '../admin-notifications/admin-notifications.module'

@Module({
  imports: [
    MongooseModule.forFeature([{name:'customers', schema: CustomersSchema}]),
    MulterModule.register({
      dest: ImageConversionUtils.imagePath
    }),
    FcmModule,
    UnitModule,
    PersonsModule,
    AdminNotificationsModule
  ],
  providers: [CustomersService],
  controllers: [CustomersController],
  exports: [CustomersService]
})
export class CustomersModule {}
