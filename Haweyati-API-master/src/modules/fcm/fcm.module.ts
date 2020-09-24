import { FcmService } from './fcm.service';
import { FcmController } from './fcm.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule, Module } from "@nestjs/common";
import { FcmSchema } from "../../data/schemas/fcm.Schema";
import { PersonsModule } from '../persons/persons.module';
import { FcmPendingSchema } from "../../data/schemas/fcmPending.Schema";
import { FcmMessagesSchema } from "../../data/schemas/fcmMessages.Schema";

@Module({
  imports : [
     MongooseModule.forFeature([
        {name: 'fcm', schema: FcmSchema},
        {name : 'fcm-messages', schema: FcmMessagesSchema},
        {name : 'fcm-pending', schema: FcmPendingSchema}
     ]),
     HttpModule,
    PersonsModule
    ],
  providers: [FcmService],
  controllers: [FcmController]
})
export class FcmModule {}
