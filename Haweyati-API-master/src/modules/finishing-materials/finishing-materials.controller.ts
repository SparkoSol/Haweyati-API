import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IFinishingMaterialsInterface} from "../../data/interfaces/finishingMaterials.interface";
import {FinishingMaterialsService} from "./finishing-materials.service";
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('finishing-materials')
export class FinishingMaterialsController extends SimpleController<IFinishingMaterialsInterface>{
    constructor(protected readonly service: FinishingMaterialsService) {
        super(service);
    }
    @Post()
    @UseInterceptors(FilesInterceptor('images'))
    postOverride(@UploadedFiles() files, @Body() finishingMaterial: any) {
        if (Array.isArray(finishingMaterial.city)) {
            const list = []
            for (let i = 0; i < finishingMaterial.city.length; ++i) {
                list.push({
                    city: finishingMaterial.city[i],
                    price: finishingMaterial.price[i],
                    days: finishingMaterial.days[i]
                })
            }
            finishingMaterial.pricing = list;
        } else {
            finishingMaterial.pricing = [{
                city: finishingMaterial.city,
                price: finishingMaterial.price,
                days: finishingMaterial.days
            }];
        }

        finishingMaterial.images = files
        return this.service.create(finishingMaterial);
    }
}
