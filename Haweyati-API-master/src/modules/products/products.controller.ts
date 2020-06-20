import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IProductsInterface} from "../../data/interfaces/products.interface";
import {ProductsService} from "./products.service";

@Controller('products')
export class ProductsController extends SimpleController<IProductsInterface>{
    constructor(protected readonly service: ProductsService) {
        super(service);
    }
}
