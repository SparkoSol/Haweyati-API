import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IScaffoldingsInterface} from "../../data/interfaces/scaffoldings.interface";
import {ScaffoldingsService} from "./scaffoldings.service";
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('scaffoldings')
export class ScaffoldingsController extends SimpleController<IScaffoldingsInterface>{
   constructor(protected readonly service: ScaffoldingsService) {
      super(service);
   }

   @Post()
   @UseInterceptors(FilesInterceptor('images'))
   postOverride(@UploadedFiles() files, @Body() scaffolding: any): any {
      if (Array.isArray(scaffolding.city)) {
         const list = []
         for (let i = 0; i < scaffolding.city.length; ++i) {
            list.push({
               city: scaffolding.city[i],
               rent: scaffolding.rent[i],
               days: scaffolding.days[i],
               extraDayRent: scaffolding.extraDayRent[i]
            })
         }
         scaffolding.pricing = list;
      } else {
         scaffolding.pricing = [{
            city: scaffolding.city,
            rent: scaffolding.rent,
            days: scaffolding.days,
            extraDayRent: scaffolding.extraDayRent
         }];
      }
      scaffolding.images = files
      return this.service.create(scaffolding);
   }

   @Get('getbytype/:type')
   async get(@Param('type') type:string): Promise<IScaffoldingsInterface[]>{
      return await this.service.getByType(type);
   }

}