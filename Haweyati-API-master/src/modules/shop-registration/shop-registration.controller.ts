import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
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
        console.log("images", images);
        data.images = images
        console.log("data", data);

        // images.forEach(image => {
        //     data.images.push({
        //         filename: image.filename,
        //         path: image.path
        //     })
        // })
        return super.post(data);
    }
}
