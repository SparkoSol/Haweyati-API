import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IDriverSupplierChats} from "../../data/interfaces/driverSupplierChats.interface";
import {DriverSupplierChatsService} from "./driver-supplier-chats.service";

@Controller('driver-supplier-chats')
export class DriverSupplierChatsController extends SimpleController<IDriverSupplierChats>{
    constructor(protected readonly service: DriverSupplierChatsService) {
        super(service);
    }
}
