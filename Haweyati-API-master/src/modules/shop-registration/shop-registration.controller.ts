import {
  Body,
  Controller,
  Patch,
  Post,
  UseInterceptors,
  Get,
  Param,
  Res,
  UploadedFile,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { IShopRegistrationInterface } from '../../data/interfaces/shop-registration.interface'
import { ShopRegistrationService } from './shop-registration.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImageController } from '../../common/lib/image.controller'

@Controller('suppliers')
export class ShopRegistrationController extends ImageController<IShopRegistrationInterface> {
  constructor(
    protected readonly service: ShopRegistrationService
  )
  {
    super(service)
  }

  @Get('pending')
  getPending(): Promise<IShopRegistrationInterface[]> {
    return this.service.getSuppliersByStatus('Pending')
  }

  @Get('available/:city')
  async Get(@Param('city') city: string): Promise<any> {
    return this.service.getAvailableServices(city)
  }

  @Get('getbyprofile/:id')
  async getByProfile(@Param('id') id: string): Promise<IShopRegistrationInterface>{
    return await this.service.getByProfile(id);
  }

  @Get('getbyservice/:name')
  async getByService(@Param('name') name: string): Promise<any> {
    return await this.service.getByService(name)
  }

  @Get('all')
  async all(): Promise<IShopRegistrationInterface[]> {
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
    const pro = await this.service.fetchFromContact(data.contact)
    let person
    if (pro) {
      if (pro._id == data.personID) {
        person = {
          _id: data.personID,
          name: data.name,
          email: data.email,
          contact: data.contact,
          username: data.contact
        }
        if (file) {
          person.image = {
            name: file.filename,
            path: file.path
          }
        }
      } else {
        throw new HttpException(
          'Contact Already Exists',
          HttpStatus.NOT_ACCEPTABLE
        )
      }
    } else {
      person = {
        _id: data.personID,
        name: data.name,
        email: data.email,
        contact: data.contact,
        username: data.contact,
        isVerified: false
      }
      if (file) {
        person.image = {
          name: file.filename,
          path: file.path
        }
      }
    }

    await this.service.updateProfile(person)
    return this.service.change(data)
  }

  @Get('cities')
  async getSupplierCities(): Promise<any>{
    return await this.service.getSupplierCities();
  }

  @Get('report')
  async report(@Res() res) {
    ;(await this.service.generateReport()).pipe(res)
  }
}
