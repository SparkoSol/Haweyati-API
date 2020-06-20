import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IDriverSupplierChatMessages} from "../../data/interfaces/driverSupplierChatMessages.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class DriverSupplierChatMessagesService extends SimpleService<IDriverSupplierChatMessages>{
    constructor(@InjectModel('driversupplierchatmessages') protected readonly model: Model<IDriverSupplierChatMessages>) {
        super(model);
    }
}
