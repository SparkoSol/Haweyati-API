import { IPerson } from 'src/data/interfaces/person.interface';
import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { SimpleController } from 'src/common/lib/simple.controller';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('persons')
export class PersonsController extends SimpleController<IPerson> {
   constructor(protected readonly service: PersonsService) {
      super(service)
   }

   @Post()
   @UseInterceptors(FileInterceptor('image'))
   //eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
   async sendVerificationCode(@UploadedFile() file, @Body() person: any): Promise<any>{
      if (file){
         person.image = {
            name: file.filename,
            path: file.path
         }
      }
      person.username = person.contact
      return  await this.service.create(person);
   }

}
