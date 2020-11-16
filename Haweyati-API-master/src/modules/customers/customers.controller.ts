import {
  Get,
  Post,
  Body,
  Patch,
  Query,
  Param,
  Controller, UseInterceptors, UploadedFile
} from '@nestjs/common'
import { CustomersService } from './customers.service'
import { ImageController } from '../../common/lib/image.controller'
import { ICustomerInterface } from '../../data/interfaces/customers.interface'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('customers')
export class CustomersController extends ImageController<ICustomerInterface> {
  constructor(protected readonly service: CustomersService) {
    super(service)
  }

  @Post()
  async post(@Body() data: any): Promise<ICustomerInterface> {
    return await this.service.create(data)
  }

  @Get('guest')
  async getGuest(): Promise<ICustomerInterface> {
    return await this.service.getGuest()
  }

  @Post('guest')
  async postGuest(@Body() data: any): Promise<ICustomerInterface> {
    return await this.service.guestNew(data)
  }

  @Post('new')
  async createCustomer(@Body() data: any): Promise<ICustomerInterface> {
    return await this.service.new(data)
  }

  @Post('new-admin')
  @UseInterceptors(FileInterceptor('image'))
  async createAdmin(@UploadedFile() file, @Body() data: any): Promise<ICustomerInterface>{
    if (file)
      data.image = {
        name: file.filename,
        path: file.path
      }
    return await this.service.createAdmin(data)
  }

  @Post('convert-guest')
  async convertFromGuest(@Body() data: any): Promise<ICustomerInterface>{
    return await this.service.convertFromGuest(data)
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
    return await this.service.getWithScopeCustomer('Active')
  }

  @Get('active-search')
  async search(@Query() query: any) {
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
  async searchBlocked(@Query() query: any) {
    return await this.service.searchBlocked(query)
  }

  @Get('guest-search')
  async searchGuest(@Query() query: any) {
    return await this.service.searchGuest(query)
  }

  @Post('guest-sign-up')
  async guestSignUp(@Body() data: any): Promise<ICustomerInterface> {
    return await this.service.guestSignUp(data)
  }

  @Patch('getunblocked/:id')
  async getUnblocked(@Param('id') id: string): Promise<any> {
    return await this.service.getUnblocked(id)
  }

  @Get('getall')
  async getAll(): Promise<ICustomerInterface[] | ICustomerInterface> {
    return await this.service.getAll()
  }

  @Get('getactive/:id')
  async getActiveById(@Param('id') id: string): Promise<any> {
    return await this.service.fetch(id)
  }

  @Get('getall/:id')
  async getById(
    @Param('id') id: string
  ): Promise<ICustomerInterface[] | ICustomerInterface> {
    return await this.service.getAll(id)
  }
}
