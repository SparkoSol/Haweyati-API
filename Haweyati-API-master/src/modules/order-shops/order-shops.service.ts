import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IOrderShopsInterface} from "../../data/interfaces/orderShops.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class OrderShopsService extends SimpleService<IOrderShopsInterface>{
    constructor(@InjectModel('ordershops') protected readonly model: Model<IOrderShopsInterface>) {
        super(model);
    }
}
