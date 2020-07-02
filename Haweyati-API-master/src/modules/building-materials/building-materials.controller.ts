import { Body, Controller, Get, Param, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IBuildingMaterialsInterface} from "../../data/interfaces/buildingMaterials.interface";
import {BuildingMaterialsService} from "./building-materials.service";
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('building-materials')
export class BuildingMaterialsController extends SimpleController<IBuildingMaterialsInterface>{
   constructor(protected readonly service: BuildingMaterialsService) {
      super(service);
   }
   @Post()
   @UseInterceptors(FilesInterceptor('images'))
   postOverride(@UploadedFiles() files, @Body() buildingMaterial: any) {
      if (Array.isArray(buildingMaterial.city)) {
         const list = []
         for (let i = 0; i < buildingMaterial.city.length; ++i) {
            list.push({
               city: buildingMaterial.city[i],
               price: buildingMaterial.price[i]
            })
         }
         buildingMaterial.pricing = list;
      } else {
         buildingMaterial.pricing = [{
            city: buildingMaterial.city,
            price: buildingMaterial.price
         }];
      }
      buildingMaterial.images = files?.map(file => ({
         name: file.filename,
         path: file.path
      }))
      return this.service.create(buildingMaterial);
   }

   @Get('getbyparent/:id')
   getByParentId(@Param('id') id: string): Promise<IBuildingMaterialsInterface[] | IBuildingMaterialsInterface> {
      return this.service.fetchByParentId(id);
   }

   @Get('available')
   async Get(@Query() data): Promise<any>{
      return await this.service.getByCity(data.city, data.parent);
   }

}