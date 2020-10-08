import { FcmService } from './fcm.service'
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { SimpleController } from '../../common/lib/simple.controller'
import { IFcmHistory } from '../../data/interfaces/fcmHistory.interface'
import { IPerson } from '../../data/interfaces/person.interface'

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

  @Patch('token')
  async updateToken(@Body() data: any): Promise<IPerson>{
    return await this.service.updateToken(data);
  }
}
