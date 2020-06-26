import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IDriversInterface} from "../../data/interfaces/drivers.interface";
import {DriverCustomerChatsService} from "./driver-customer-chats.service";
import { IDriverCustomerChats } from '../../data/interfaces/driverCustomerChats.interface';

@Controller('driver-customer-chats')
export class DriverCustomerChatsController extends SimpleController<IDriverCustomerChats>{
    constructor(protected readonly service: DriverCustomerChatsService) {
        super(service);
    }
}
