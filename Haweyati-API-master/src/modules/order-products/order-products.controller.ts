import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IOrderProductsInterface} from "../../data/interfaces/orderProducts.interface";
import {OrderProductsService} from "./order-products.service";

@Controller('order-products')
export class OrderProductsController extends SimpleController<IOrderProductsInterface>{
    constructor(protected readonly service: OrderProductsService) {
        super(service);
    }
}
