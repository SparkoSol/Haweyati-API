import {
  Get,
  Body,
  Post,
  Patch,
  Controller,
  UploadedFile,
  UseInterceptors, Param
} from '@nestjs/common'
import { PersonsService } from './persons.service'
import { IPerson } from 'src/data/interfaces/person.interface'
import { ImageController } from '../../common/lib/image.controller'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('persons')
export class PersonsController extends ImageController<IPerson> {
  constructor(
    protected readonly service: PersonsService
  )
  {
    super(service)
  }

  @Patch()
  @UseInterceptors(FileInterceptor('image'))
  async patch(@UploadedFile('image') file: any, @Body() document: any){
    if(document.contact)
      document.username = document.contact
    document.isVerified = undefined
    return super.patch(file, document)
  }

  @Patch('token')
  async updateToken(@Body() data: any): Promise<IPerson>{
    return await this.service.updateToken(data);
  }

  @Post('forgotpassword')
  async forgotPassword(@Body() data: any) {
    return await this.service.forgotPassword(data.email)
  }

  @Post('resetpassword')
  async changePassword(@Body() data: any): Promise<any> {
    return await this.service.changePassword(data)
  }

  @Patch('update-password')
  async updatePassword(@Body() data: any): Promise<IPerson>{
    return await this.service.updatePassword(data)
  }

  @Post('contact/change-password')
  async changePasswordWithContact(@Body() data: any): Promise<any>{
    return await this.service.changePasswordWithContact(data)
  }

  @Get('persons-notification')
  async getExceptAdmin(): Promise<IPerson[]>{
    return await this.service.exceptAdmin();
  }

  @Get('contact/:contact')
  async isContactExists(@Param('contact') contact: string): Promise<IPerson>{
    return await this.service.isContactExists(contact)
  }
}
