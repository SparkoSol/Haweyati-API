import { Controller, Post } from "@nestjs/common";
import {SimpleController} from "../../common/lib/simple.controller";
import {IOrdersInterface} from "../../data/interfaces/orders.interface";
import {OrdersService} from "./orders.service";

@Controller('orders')
export class OrdersController extends SimpleController<IOrdersInterface>{
    constructor(protected readonly service: OrdersService) {
        super(service);
    }
}
