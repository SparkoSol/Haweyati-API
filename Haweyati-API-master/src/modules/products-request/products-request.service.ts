import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {IProductsRequestInterface} from "../../data/interfaces/productsRequest.interface";

@Injectable()
export class ProductsRequestService extends SimpleService<IProductsRequestInterface>{
    constructor(@InjectModel('productsrequest') protected readonly model : Model<IProductsRequestInterface>) {
        super(model);
    }
}
