import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {ICouponsInterface} from "../../data/interfaces/coupons.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class CouponsService extends SimpleService<ICouponsInterface>{
    constructor(@InjectModel('coupons') protected readonly model: Model<ICouponsInterface>) {
        super(model);
    }
}
