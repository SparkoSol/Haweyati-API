import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IOrderProductsInterface} from "../../data/interfaces/orderProducts.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class OrderProductsService extends SimpleService<IOrderProductsInterface>{
    constructor(@InjectModel('orderproducts') protected readonly model: Model<IOrderProductsInterface>) {
        super(model);
    }
}
