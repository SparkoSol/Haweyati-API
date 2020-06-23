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
                    price: buildingMaterial.price[i],
                    days: buildingMaterial.days[i]
                })
            }
            buildingMaterial.pricing = list;
        } else {
            buildingMaterial.pricing = [{
                city: buildingMaterial.city,
                price: buildingMaterial.price,
                days: buildingMaterial.days
            }];
        }

        buildingMaterial.images = files
        return this.service.create(buildingMaterial);
    }
}