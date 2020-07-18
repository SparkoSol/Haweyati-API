import { HttpModule, Module } from "@nestjs/common";
import { FcmService } from './fcm.service';
import { FcmController } from './fcm.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { FcmSchema } from "../../data/schemas/fcm.Schema";
import { FcmMessagesSchema } from "../../data/schemas/fcmMessages.Schema";
import { FcmPendingSchema } from "../../data/schemas/fcmPending.Schema";

@Module({
  imports : [
     MongooseModule.forFeature([
        {name: 'fcm', schema: FcmSchema},
        {name : 'fcm-messages', schema: FcmMessagesSchema},
        {name : 'fcm-pending', schema: FcmPendingSchema}
     ]),
     HttpModule
    ],
  providers: [FcmService],
  controllers: [FcmController]
})
export class FcmModule {}
