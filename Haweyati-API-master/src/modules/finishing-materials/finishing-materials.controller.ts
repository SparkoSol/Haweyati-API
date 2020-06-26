import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
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
        console.log(finishingMaterial)
        // if (Array.isArray(finishingMaterial.city)) {
        //     const list = []
        //     for (let i = 0; i < finishingMaterial.city.length; ++i) {
        //         list.push({
        //             city: finishingMaterial.city[i],
        //             price: finishingMaterial.price[i]
        //         })
        //     }
        //     finishingMaterial.pricing = list;
        // } else {
        //     finishingMaterial.pricing = [{
        //         city: finishingMaterial.city,
        //         price: finishingMaterial.price
        //     }];
        // }

        finishingMaterial.images = files
        return this.service.create(finishingMaterial);
    }

    @Get('getbyparent/:id')
    getByParentId(@Param('id') id: string): Promise<IFinishingMaterialsInterface[] | IFinishingMaterialsInterface> {
        return this.service.fetchByParentId(id);
    }
}