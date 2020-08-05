import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseInterceptors
} from '@nestjs/common'
import { SimpleController } from '../../common/lib/simple.controller'
import { IDriversInterface } from '../../data/interfaces/drivers.interface'
import { DriversService } from './drivers.service'
import { IDriverRequest } from '../../data/interfaces/driverRequest.interface'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('drivers')
export class DriversController extends SimpleController<IDriversInterface> {
  constructor(protected readonly service: DriversService) {
    super(service)
  }
  @Get('getrequests')
  async getRequests(): Promise<IDriverRequest[]> {
    return this.service.getRequests()
  }

  @Get('getverified')
  async getVerifiedDrivers(): Promise<IDriversInterface[]> {
    return await this.service.getVerified()
  }

  @Patch('getverified/:id')
  async getVerified(@Param('id') id: string): Promise<any> {
    return await this.service.getVerified(id)
  }

  @Get('getrejected')
  async getRejectedDrivers(): Promise<IDriversInterface[]> {
    return await this.service.getRejected()
  }

  @Patch('getrejected/:id')
  async getRejected(@Param('id') id: string, @Body() data: any): Promise<any> {
    return await this.service.getRejected(id, data)
  }

  @Get('getblocked')
  async getBlockedDrivers(): Promise<IDriversInterface[]> {
    return await this.service.getBlocked()
  }

  @Patch('getblocked/:id')
  async getBlocked(@Param('id') id: string): Promise<any> {
    return this.service.getBlocked(id)
  }

  @Patch('getunblocked/:id')
  async getUnblocked(@Param('id') id: string): Promise<any> {
    return await this.service.getUnblocked(id)
  }

  @Get('getcompanydrivers/:id')
  async getCompanyDrivers(@Param('id') id: string): Promise<any> {
    return await this.service.getCompanyDrivers(id)
  }

  @Get('getbyperson/:id')
  async getByPersonId(@Param('id') id: string) {
    return await this.service.getByPersonId(id)
  }

  @Patch()
  async patch(@Body() data: any): Promise<IDriversInterface> {
    console.log(data)
    return super.patch(data)
  }
}
