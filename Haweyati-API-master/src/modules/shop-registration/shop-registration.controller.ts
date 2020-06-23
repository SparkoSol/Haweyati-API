import { Body, Controller, Patch, Post, UploadedFiles, UseInterceptors, Get, Param, Query } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IShopRegistrationInterface} from "../../data/interfaces/shopRegistration.interface";
import {ShopRegistrationService} from "./shop-registration.service";
import { FilesInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';

@Controller('suppliers')
export class ShopRegistrationController extends SimpleController<IShopRegistrationInterface>{
    constructor(protected readonly service: ShopRegistrationService) {
        super(service);
    }
    @Post()
    @UseInterceptors(FilesInterceptor('images'))
    Post(@UploadedFiles() images, @Body() data: IShopRegistrationInterface): Promise<IShopRegistrationInterface> {
        data.images = images
        return super.post(data);
    }
    @Patch()
    @UseInterceptors(FilesInterceptor('images'))
    Patch(@UploadedFiles() images, @Body() data: any): Promise<IShopRegistrationInterface>{
        data.images.push(images);
        return super.patch(data);
    }

    @Get('available/:city')
    async Get(@Param('city') city: string): Promise<string[]>{
        console.log((await this.service.getCity('27.2038', '77.5011')).data)
        // this.service.getDistance('27.2038', '77.5011', '127.2038', '177.5011')
        return this.service.getDataFromCity(city);
    }
}