import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {SimpleService} from "../../common/lib/simple.service";
import {IProductsRequestInterface} from "../../data/interfaces/productsRequest.interface";

@Controller('products-request')
export class ProductsRequestController extends SimpleController<IProductsRequestInterface>{
    constructor(protected readonly service: SimpleService<IProductsRequestInterface>) {
        super(service);
    }
}
