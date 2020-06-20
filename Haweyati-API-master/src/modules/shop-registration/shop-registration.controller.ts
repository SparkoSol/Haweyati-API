import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IShopRegistrationInterface} from "../../data/interfaces/shopRegistration.interface";
import {ShopRegistrationService} from "./shop-registration.service";

@Controller('shop-registration')
export class ShopRegistrationController extends SimpleController<IShopRegistrationInterface>{
    constructor(protected readonly service: ShopRegistrationService) {
        super(service);
    }
}
