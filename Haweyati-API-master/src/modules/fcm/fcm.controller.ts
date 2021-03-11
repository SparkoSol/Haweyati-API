import { FcmService } from './fcm.service'
import { IPerson } from '../../data/interfaces/person.interface'
import { SimpleController } from '../../common/lib/simple.controller'
import { IFcmHistory } from '../../data/interfaces/fcmHistory.interface'
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { IFcmAllHistory } from '../../data/interfaces/fcmAllHistory.interfce'

@Controller('fcm')
export class FcmController extends SimpleController<IFcmHistory>{
  constructor(protected readonly service: FcmService) {
    super(service);
  }

  @Post('send-all')
  async sendAll(@Body() data: any): Promise<IFcmAllHistory>{
    return await this.service.sendAll(data);
  }

  @Get('send-pending/:id')
  async sendPendingNotifications(@Param('id') id: string): Promise<void>{
    return await this.service.sendPending(id)
  }

  @Patch('token')
  async updateToken(@Body() data: any): Promise<IPerson>{
    return await this.service.updateToken(data);
  }

  @Get('get-history')
  async history(): Promise<IFcmAllHistory[]>{
    return await this.service.history()
  }

  @Get('get-history/:id')
  async personHistory(@Param('id') id: string): Promise<IFcmHistory[]>{
    return await this.service.personHistory(id)
  }

  @Get('get-unseen/:id')
  async personUnseenHistory(@Param('id') id: string): Promise<IFcmHistory[]>{
    return await this.service.personUnseenHistory(id)
  }

  @Patch('seen-to-unseen/:id')
  async seenToUnseenHistory(@Param('id') id: string): Promise<any>{
    return await this.service.seenToUnseenHistory(id)
  }
}
