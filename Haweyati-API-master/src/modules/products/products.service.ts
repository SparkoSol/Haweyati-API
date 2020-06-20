import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IProductsInterface} from "../../data/interfaces/products.interface";
import {InjectModel} from "@nestjs/mongoose";
import { ProductsSchema } from "../../data/schemas/products.schema";
import {Model} from "mongoose";

@Injectable()
export class ProductsService extends SimpleService<IProductsInterface>{
    constructor(@InjectModel('products') protected readonly model:Model<IProductsInterface>) {
        super(model);
    }
}
