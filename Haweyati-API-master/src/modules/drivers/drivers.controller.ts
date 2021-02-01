import { IDriversInterface } from '../../data/interfaces/drivers.interface'
import { Get, Body, Patch, Param, Controller } from '@nestjs/common'
import { ImageController } from '../../common/lib/image.controller'
import { DriversService } from './drivers.service'

@Controller('drivers')
export class DriversController extends ImageController<IDriversInterface> {
  constructor(protected readonly service: DriversService) {
    super(service)
  }

  @Get('getrequests')
  async getRequests(): Promise<IDriversInterface[]> {
    return await this.service.getByStatus('Pending')
  }

  @Get('getverified')
  async getVerifiedDrivers(): Promise<IDriversInterface[]> {
    return await this.service.getByStatus('Active')
  }

  @Get('getverified/stand-alone')
  async getVerifiedStandAloneDrivers(): Promise<IDriversInterface[]> {
    return await this.service.getVerifiedStandAloneDrivers()
  }

  @Get('getrejected')
  async getRejectedDrivers(): Promise<IDriversInterface[]> {
    return await this.service.getByStatus('Rejected')
  }

  @Get('getblocked')
  async getBlockedDrivers(): Promise<IDriversInterface[]> {
    return await this.service.getByStatus('Blocked')
  }

  @Patch('getverified/:id')
  async getVerified(@Param('id') id: string): Promise<any> {
    return await this.service.updateByStatus(id, 'Active')
  }

  @Patch('getrejected/:id')
  async getRejected(@Param('id') id: string, @Body() data: any): Promise<any> {
    return await this.service.getRejected(id, data)
  }

  @Patch('getblocked/:id')
  async getBlocked(@Param('id') id: string): Promise<any> {
    return this.service.updateByStatus(id, 'Blocked')
  }

  @Patch('getunblocked/:id')
  async getUnblocked(@Param('id') id: string): Promise<any> {
    return await this.service.updateByStatus(id, 'Active')
  }

  @Get('supplier/:id')
  async getCompanyDrivers(@Param('id') id: string): Promise<any> {
    return await this.service.getCompanyDrivers(id)
  }

  @Get('getbyperson/:id')
  async getByPersonId(@Param('id') id: string) {
    return await this.service.getByPersonId(id)
  }
}
