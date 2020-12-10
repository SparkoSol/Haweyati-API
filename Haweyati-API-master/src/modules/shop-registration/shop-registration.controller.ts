import {
  Get,
  Body,
  Patch,
  Param,
  Controller,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express'
import { ImageController } from '../../common/lib/image.controller'
import { ShopRegistrationService } from './shop-registration.service'
import { IShopRegistration } from '../../data/interfaces/shop-registration.interface'

@Controller('suppliers')
export class ShopRegistrationController extends ImageController<
  IShopRegistration
> {
  constructor(protected readonly service: ShopRegistrationService) {
    super(service)
  }

  @Get('pending')
  getPending(): Promise<IShopRegistration[]> {
    return this.service.getSuppliersByStatus('Pending')
  }

  @Get('available/:city')
  async Get(@Param('city') city: string): Promise<any> {
    return this.service.getAvailableServices(city)
  }

  @Get('getbyprofile/:id')
  async getByProfile(
    @Param('id') id: string
  ): Promise<IShopRegistration> {
    return await this.service.getByProfile(id)
  }

  @Get('getbyservice/:name')
  async getByService(@Param('name') name: string): Promise<any> {
    return await this.service.getByService(name)
  }

  @Get('all')
  async all(): Promise<IShopRegistration[]> {
    return await this.service.fetchAll()
  }

  @Get('getrejected')
  async getAllRejected(): Promise<any> {
    return this.service.getSuppliersByStatus('Rejected')
  }

  @Patch('getrejected/:id')
  async getRejected(@Param('id') id: string): Promise<any> {
    return this.service.changeSupplierStatus(id, 'Rejected')
  }

  @Get('getsubsuppliers/:id')
  async subSuppliers(@Param('id') id: string): Promise<any> {
    return this.service.getSubSuppliers(id)
  }

  @Patch('approve/:id')
  approve(@Param('id') id: string): Promise<any> {
    return this.service.changeSupplierStatus(id, 'Active')
  }

  @Patch()
  @UseInterceptors(FileInterceptor('image'))
  async Patch(@UploadedFile() file, @Body() data: any) {
    return await super.patch(file, data);
  }

  @Get('cities')
  async getSupplierCities(): Promise<any> {
    return await this.service.getSupplierCities()
  }

  @Get('block')
  async blockedSuppliers(): Promise<IShopRegistration[]>{
    return await this.service.getBlockedSuppliersWithoutParent()
  }

  @Patch('block/:id')
  async blockSupplier(@Param('id') id: string): Promise<any>{
    return await this.service.changeSupplierStatus(id, 'Blocked')
  }

  @Get('cities')
  async getCities(): Promise<string[]>{
    return await this.service.suppliersCities()
  }
}