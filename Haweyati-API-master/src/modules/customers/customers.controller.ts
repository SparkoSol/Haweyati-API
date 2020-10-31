import {
  Get,
  Body,
  Patch,
  Query,
  Param,
  Controller,
} from '@nestjs/common'
import { CustomersService } from './customers.service'
import { ImageController } from '../../common/lib/image.controller'
import { ICustomerInterface } from '../../data/interfaces/customers.interface'

@Controller('customers')
export class CustomersController extends ImageController<ICustomerInterface> {
  constructor(
    protected readonly service: CustomersService
  )
  {
    super(service)
  }

  @Patch('getblocked/:id')
  async getBlocked(
    @Param('id') id: string,
    @Body() message?: any
  ): Promise<any> {
    if (message) return await this.service.getBlocked(id, message.message)
    else return await this.service.getBlocked(id)
  }

  @Get('getactive')
  async getActive(): Promise<any> {
    return await this.service.fetch()
  }

  @Get('active-search')
  async search(@Query() query: any){
    return await this.service.searchActive(query)
  }

  @Get('getblocked')
  async getAllBlocked(): Promise<any> {
    return await this.service.getBlocked()
  }

  @Get('getprofile/:contact')
  async getProfile(
    @Param('contact') contact: string
  ): Promise<ICustomerInterface | string> {
    return await this.service.getProfile(contact)
  }

  @Get('blocked-search')
  async searchBlocked(@Query() query: any){
    return await this.service.searchBlocked(query)
  }

  @Patch('getunblocked/:id')
  async getUnblocked(@Param('id') id: string): Promise<any> {
    return await this.service.getUnblocked(id)
  }

  @Get('getall')
  async getAll(): Promise<ICustomerInterface[] | ICustomerInterface>{
    return await this.service.getAll();
  }

  @Get('getactive/:id')
  async getActiveById(@Param('id') id: string): Promise<any> {
    return await this.service.fetch(id)
  }

  @Get('getall/:id')
  async getById(@Param('id') id: string): Promise<ICustomerInterface[] | ICustomerInterface>{
    return await this.service.getAll(id);
  }
}
