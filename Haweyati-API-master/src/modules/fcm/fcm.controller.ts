import { FcmService } from './fcm.service'
import { IFcm } from '../../data/interfaces/fcm.interface'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { SimpleController } from '../../common/lib/simple.controller'
import { IFcmMessages } from '../../data/interfaces/fcmMessages.interface'

@Controller('fcm')
export class FcmController extends SimpleController<IFcm> {
  constructor(
    protected readonly service: FcmService
  )
  {
    super(service)
  }

  @Post('notification')
  async notification(@Body() data: any) {
    return await this.service.notification(data)
  }

  @Get('get-history')
  async getFcmHistory(): Promise<IFcmMessages[]>{
    return await this.service.getFcmHistory();
  }

  @Get('person/:id')
  async getPersonHistory(@Param('id') id: string): Promise<IFcmMessages[]>{
    return await this.service.getPersonHistory(id)
  }
}