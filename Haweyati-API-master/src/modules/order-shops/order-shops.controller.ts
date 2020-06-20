import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IOrderShopsInterface} from "../../data/interfaces/orderShops.interface";
import {OrderShopsService} from "./order-shops.service";

@Controller('order-shops')
export class OrderShopsController extends SimpleController<IOrderShopsInterface> {
    constructor(protected readonly service: OrderShopsService) {
        super(service);
    }
}
