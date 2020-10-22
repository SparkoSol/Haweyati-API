import { Controller } from '@nestjs/common';
import { InvitationService } from './invitation.service'

@Controller('invitation')
export class InvitationController {
  constructor(protected readonly service: InvitationService) {}
}
