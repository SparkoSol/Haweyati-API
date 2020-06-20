import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IOrdersInterface} from "../../data/interfaces/orders.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class OrdersService extends SimpleService<IOrdersInterface>{
    constructor(@InjectModel('orders') protected readonly model: Model<IOrdersInterface>) {
        super(model);
    }
}
