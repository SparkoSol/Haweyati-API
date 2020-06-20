import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IDriverCustomerChatMessages} from "../../data/interfaces/driverCustomerChatMessages.interface";
import {DriverCustomerChatMessagesService} from "./driver-customer-chat-messages.service";

@Controller('driver-customer-chat-messages')
export class DriverCustomerChatMessagesController extends SimpleController<IDriverCustomerChatMessages>{
    constructor(protected readonly service: DriverCustomerChatMessagesService) {
        super(service);
    }
}
