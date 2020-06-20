import { IPerson } from 'src/data/interfaces/person.interface';
import { Controller, Post, UseInterceptors, UploadedFile, Body, UploadedFiles } from '@nestjs/common';
import { SimpleController } from 'src/common/lib/simple.controller';
import { SecuredController } from 'src/common/lib/secured.controller';
import { DumpstersService } from './dumpsters.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {IDumpster} from "../../data/interfaces/dumpster.interface";

@Controller('dumpsters')
export class DumpstersController extends SimpleController<IDumpster> {
  constructor(protected readonly service: DumpstersService) {
    super(service)
  }

  @Post()
  @UseInterceptors(FilesInterceptor('file'))
  postOverride(@UploadedFiles() files, @Body() dumpster: IDumpster) {
    dumpster.images = []
    files.forEach(file => {
      dumpster.images.push({
        name: file.filename,
        path: file.path
      })
    })

    return this.service.create(dumpster);
  }

}
