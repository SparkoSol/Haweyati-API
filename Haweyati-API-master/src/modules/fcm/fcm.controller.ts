import { Body, Controller, Post } from '@nestjs/common'
import { SimpleController } from '../../common/lib/simple.controller'
import { IFcm } from '../../data/interfaces/fcm.interface'
import { FcmService } from './fcm.service'

@Controller('fcm')
export class FcmController extends SimpleController<IFcm> {
  constructor(protected readonly service: FcmService) {
    super(service)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @Post('notification')
  async notification(@Body() data: any) {
    return await this.service.notification(data)
  }
}
