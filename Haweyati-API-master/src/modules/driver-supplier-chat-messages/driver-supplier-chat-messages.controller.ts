import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IDriverSupplierChatMessages} from "../../data/interfaces/driverSupplierChatMessages.interface";
import {DriverCustomerChatMessagesService} from "../driver-customer-chat-messages/driver-customer-chat-messages.service";

@Controller('driver-supplier-chat-messages')
export class DriverSupplierChatMessagesController extends SimpleController<IDriverSupplierChatMessages>{
    constructor(protected readonly service: DriverCustomerChatMessagesService) {
        super(service);
    }
}
