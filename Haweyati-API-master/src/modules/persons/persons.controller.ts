import { IPerson } from 'src/data/interfaces/person.interface';
import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { FileInterceptor } from "@nestjs/platform-express";
import { ImageController } from "../../common/lib/image.controller";

@Controller('persons')
export class PersonsController extends ImageController<IPerson> {
   constructor(protected readonly service: PersonsService) {
      super(service)
   }

   @Post()
   @UseInterceptors(FileInterceptor('image'))
   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
   async post(@UploadedFile() file, @Body() person: any): Promise<any>{
      person.username = person.contact
      return  super.post(file, person)
   }

}
