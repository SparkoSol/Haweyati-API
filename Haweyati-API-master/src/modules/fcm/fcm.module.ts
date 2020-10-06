import { FcmService } from './fcm.service';
import { FcmController } from './fcm.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule, Module } from '@nestjs/common';
import { FcmHistory } from '../../data/schemas/fcmHistory.schema'
import { FcmAllHistory } from '../../data/schemas/fcmAllHistory.schema'
import { PersonsModule } from '../persons/persons.module'

@Module({
  imports: [MongooseModule.forFeature([
    {name: 'fcmhistory', schema: FcmHistory},
    {name: 'fcmall', schema: FcmAllHistory}
  ]),
    PersonsModule,
    HttpModule
  ],
  providers: [FcmService],
  controllers: [FcmController],
  exports: [FcmService]
})
export class FcmModule {}
