import { ISupplier } from 'src/data/interfaces/supplier.interface';
import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SimpleController } from 'src/common/lib/simple.controller';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { IDumpster } from '../../data/interfaces/dumpster.interface';

@Controller('suppliers')
export class SuppliersController extends SimpleController<ISupplier> {
  constructor(protected readonly service: SuppliersService) {
    super(service)
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  postOverride(@UploadedFile() file, @Body() supplier: ISupplier) {
    supplier.image =  file != null ?  {
      path: file.path,
      name: file.filename
    }: null;

    supplier.location = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      latitude: supplier.location[0],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      longitude: supplier.location[1]
    }
    supplier.parentId = null;

    // supplier.profilePic.name = file.filename
    // supplier.profilePic.path = file.path

    return this.service.create(supplier);
  }


}
