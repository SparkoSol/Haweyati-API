import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IShopRegistrationInterface} from "../../data/interfaces/shopRegistration.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class ShopRegistrationService extends SimpleService<IShopRegistrationInterface>{
    constructor(@InjectModel('shopregistration') protected readonly model:Model<IShopRegistrationInterface>) {
        super(model);
    }
}
