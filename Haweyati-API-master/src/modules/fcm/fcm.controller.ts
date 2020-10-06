import { FcmService } from './fcm.service'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { SimpleController } from '../../common/lib/simple.controller'
import { IFcmHistory } from '../../data/interfaces/fcmHistory.interface'

@Controller('fcm')
export class FcmController extends SimpleController<IFcmHistory>{
  constructor(protected readonly service: FcmService) {
    super(service);
  }

  @Post('send-all')
  async sendAll(@Body() data: any){
    return await this.service.sendAll(data);
  }

  @Get('send-pending/:id')
  async sendPendingNotifications(@Param('id') id: string){
    return await this.service.sendPending(id)
  }

  @Post('test')
  async testing(@Body() data: any){
    return this.service.testing(data);
  }
}
