import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IDriverCustomerChatMessages} from "../../data/interfaces/driverCustomerChatMessages.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class DriverCustomerChatMessagesService extends SimpleService<IDriverCustomerChatMessages>{
    constructor(@InjectModel('drivercustomerchatmessages') protected readonly model: Model<IDriverCustomerChatMessages>) {
        super(model);
    }
}
