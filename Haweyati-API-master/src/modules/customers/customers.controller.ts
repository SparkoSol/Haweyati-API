import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { CustomersService } from './customers.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImageController } from '../../common/lib/image.controller'
import { ICustomer } from '../../data/interfaces/customer.interface'
import { dtoCustomer, dtoCustomerQuery } from '../../data/dtos/customer.dto'

@Controller('customers')
export class CustomersController extends ImageController<ICustomer> {
  constructor(protected readonly service: CustomersService) {
    super(service)
  }

  @Post()
  async post(@Body() data: dtoCustomer): Promise<ICustomer> {
    return await this.service.create(data)
  }

  @Get('guest')
  async getGuest(): Promise<ICustomer[]> {
    return await this.service.getGuest()
  }

  @Post('guest')
  async postGuest(@Body() data: ICustomer): Promise<ICustomer> {
    return await this.service.guestNew(data)
  }

  @Post('new')
  async createCustomer(@Body() data: ICustomer): Promise<ICustomer> {
    return await this.service.new(data)
  }

  @Post('new-admin')
  @UseInterceptors(FileInterceptor('image'))
  async createAdmin(
    @UploadedFile() file,
    @Body() data: dtoCustomer
  ): Promise<ICustomer> {
    if (file)
      data.image = {
        name: file.filename,
        path: file.path
      }
    return await this.service.createAdmin(data)
  }

  @Post('convert-guest')
  async convertFromGuest(@Body() data: dtoCustomer): Promise<ICustomer> {
    return await this.service.convertFromGuest(data)
  }

  @Patch('getblocked/:id')
  async getBlocked(
    @Param('id') id: string,
    @Body() message?: { message: string }
  ): Promise<ICustomer> {
    if (message)
      return (await this.service.getBlocked(id, message.message)) as ICustomer
    else return (await this.service.getBlocked(id)) as ICustomer
  }

  @Get('getactive')
  async getActive(): Promise<ICustomer[]> {
    return await this.service.getCustomers()
  }

  @Get('active-search')
  async search(@Query() query: dtoCustomerQuery): Promise<ICustomer[]> {
    return await this.service.search(query, 'Active', 'customer')
  }

  @Get('getblocked')
  async getAllBlocked(): Promise<ICustomer[]> {
    return (await this.service.getBlocked()) as ICustomer[]
  }

  @Get('getprofile/:contact')
  async getProfile(@Param('contact') contact: string): Promise<ICustomer> {
    return await this.service.getProfile(contact)
  }

  @Get('blocked-search')
  async searchBlocked(@Query() query: dtoCustomerQuery): Promise<ICustomer[]> {
    return await this.service.search(query, 'Blocked', 'customer')
  }

  @Get('guest-search')
  async searchGuest(@Query() query: dtoCustomerQuery): Promise<ICustomer[]> {
    return await this.service.search(query, 'Active', 'guest')
  }

  @Patch('getunblocked/:id')
  async getUnblocked(@Param('id') id: string): Promise<ICustomer> {
    return await this.service.Unblock(id)
  }

  @Get('getall')
  async getAll(): Promise<ICustomer[] | ICustomer> {
    return await this.service.getAll()
  }

  @Get('getactive/:id')
  async getActiveById(@Param('id') id: string): Promise<ICustomer> {
    return (await this.service.fetch(id)) as ICustomer
  }

  @Get('getall/:id')
  async getById(@Param('id') id: string): Promise<ICustomer[] | ICustomer> {
    return await this.service.getAll(id)
  }
}
