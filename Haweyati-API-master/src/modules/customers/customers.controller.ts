import {
  Body,
  Controller,
  Get,
  Param,
  Patch, Post, Query, UploadedFile, UseInterceptors
} from '@nestjs/common'
import { ICustomerInterface } from '../../data/interfaces/customers.interface'
import { CustomersService } from './customers.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImageController } from '../../common/lib/image.controller'

@Controller('customers')
export class CustomersController extends ImageController<ICustomerInterface> {
  constructor(
    protected readonly service: CustomersService
  )
  {
    super(service)
  }

  @Get('getactive')
  async getActive(): Promise<any> {
    return await this.service.fetch()
  }

  @Get('getactive/:id')
  async getActiveById(@Param('id') id: string): Promise<any> {
    return await this.service.fetch(id)
  }

  @Get('getblocked')
  async getAllBlocked(): Promise<any> {
    return await this.service.getBlocked()
  }

  @Get('getall')
  async getAll(): Promise<ICustomerInterface[] | ICustomerInterface>{
    return await this.service.getAll();
  }

  @Get('getall/:id')
  async getById(@Param('id') id: string): Promise<ICustomerInterface[] | ICustomerInterface>{
    return await this.service.getAll(id);
  }

  @Get('getprofile/:contact')
  async getProfile(
    @Param('contact') contact: string
  ): Promise<ICustomerInterface | string> {
    return await this.service.getProfile(contact)
  }

  @Patch('getblocked/:id')
  async getBlocked(
    @Param('id') id: string,
    @Body() message?: any
  ): Promise<any> {
    if (message) return await this.service.getBlocked(id, message.message)
    else return await this.service.getBlocked(id)
  }

  @Patch('getunblocked/:id')
  async getUnblocked(@Param('id') id: string): Promise<any> {
    return await this.service.getUnblocked(id)
  }

  @Get('active-search')
  async search(@Query() query: any){
    return await this.service.searchActive(query)
  }

  @Get('blocked-search')
  async searchBlocked(@Query() query: any){
    return await this.service.searchBlocked(query)
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async post(@UploadedFile() file, @Body() data: any): Promise<any> {
    return await super.post(file, data);
  }
}
