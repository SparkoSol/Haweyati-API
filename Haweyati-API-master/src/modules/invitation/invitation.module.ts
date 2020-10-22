import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { InvitationCodeSchema } from '../../data/schemas/invitationCode.schema'

@Module({
  imports: [MongooseModule.forFeature([{name: 'invitation', schema: InvitationCodeSchema}])],
  exports: [InvitationService],
  providers: [InvitationService],
  controllers: [InvitationController]
})
export class InvitationModule {}
