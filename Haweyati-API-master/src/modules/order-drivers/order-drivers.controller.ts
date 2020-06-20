import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IOrderDriversInterface} from "../../data/interfaces/orderDrivers.interface";
import {OrderDriversService} from "./order-drivers.service";

@Controller('order-drivers')
export class OrderDriversController extends SimpleController<IOrderDriversInterface>{
    constructor(protected readonly service: OrderDriversService) {
        super(service);
    }
}
