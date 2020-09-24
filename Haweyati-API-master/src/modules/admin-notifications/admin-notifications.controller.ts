import { Controller, Patch } from '@nestjs/common'
import { SimpleController } from '../../common/lib/simple.controller'
import { AdminNotificationsService } from './admin-notifications.service'
import { IAdminNotification } from '../../data/interfaces/adminNotification.interface'

@Controller('admin-notifications')
export class AdminNotificationsController extends SimpleController<IAdminNotification>{
  constructor(protected readonly service: AdminNotificationsService) {
    super(service);
  }

  @Patch()
  async patch(): Promise<any> {
    return await this.service.change()
  }
}
