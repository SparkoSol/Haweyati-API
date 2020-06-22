import { Controller, Post, UseInterceptors, Body, UploadedFiles } from '@nestjs/common';
import { SimpleController } from 'src/common/lib/simple.controller';
import { DumpstersService } from './dumpsters.service';
import {IDumpster} from "../../data/interfaces/dumpster.interface";
import {FilesInterceptor} from '@nestjs/platform-express';

@Controller('dumpsters')
export class DumpstersController extends SimpleController<IDumpster> {
  constructor(protected readonly service: DumpstersService) {
    super(service);
  }
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  postOverride(@UploadedFiles() files, @Body() dumpster: any) {
    if (Array.isArray(dumpster.city)) {
      const list = []
      for (let i = 0; i < dumpster.city.length; ++i) {
        list.push({
          city: dumpster.city[i],
          rent: dumpster.rent[i],
          days: dumpster.days[i],
          extraDayRent: dumpster.extraDayRent[i]
        })
      }
      dumpster.pricing = list;
    } else {
      dumpster.pricing = [{
        city: dumpster.city,
        rent: dumpster.rent,
        days: dumpster.days,
        extraDayRent: dumpster.extraDayRent
      }];
    }

    dumpster.images = files
    return this.service.create(dumpster);
  }
}