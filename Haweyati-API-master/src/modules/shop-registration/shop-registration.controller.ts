import { Body, Controller, Patch, Post, UploadedFiles, UseInterceptors, Get, Param, Query } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IShopRegistrationInterface} from "../../data/interfaces/shopRegistration.interface";
import {ShopRegistrationService} from "./shop-registration.service";
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('suppliers')
export class ShopRegistrationController extends SimpleController<IShopRegistrationInterface>{
    constructor(protected readonly service: ShopRegistrationService) {
        super(service);
    }
    @Post()
    @UseInterceptors(FilesInterceptor('images'))
    Post(@UploadedFiles() images, @Body() data: IShopRegistrationInterface): Promise<IShopRegistrationInterface> {
        data.images = images.map(file => ({
            name: file.filename,
            path: file.path
        }))
        return super.post(data);
    }
    @Patch()
    @UseInterceptors(FilesInterceptor('images'))
    Patch(@UploadedFiles() images, @Body() data: any): Promise<IShopRegistrationInterface>{
        data.images.push(images);
        return super.patch(data);
    }

    @Get('available')
    async Get(@Query() location): Promise<any>{
        // this.service.getLocationData(30.157457, 71.524918);
        // this.service.getDistance(30.157457, 71.524918, 31.520370, 74.358749)
        return this.service.getDataFromCoordinates(location.lat, location.lng);
    }

    @Get('getsubsuppliers/:id')
    async subsuppliers(@Param('id') id: string): Promise<any>{
        return this.service.getSubsuppliers(id);
    }

}