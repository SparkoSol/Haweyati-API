import { Body, Controller, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
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
        data.images = images
        return super.post(data);
    }
    @Patch()
    @UseInterceptors(FilesInterceptor('images'))
    Patch(@UploadedFiles() images, @Body() data: any): Promise<IShopRegistrationInterface>{
        console.log(data)
        console.log(images)
        data.images = images;
        return super.patch(data);
    }
}