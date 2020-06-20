import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IRejectedProducts} from "../../data/interfaces/rejectedProducts.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class RejectedProductsService extends SimpleService<IRejectedProducts>{
    constructor(@InjectModel('rejectedproducts') protected readonly model: Model<IRejectedProducts>) {
        super(model);
    }
}
