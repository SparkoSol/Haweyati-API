import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IDriverCustomerChats} from "../../data/interfaces/driverCustomerChats.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class DriverCustomerChatsService extends SimpleService<IDriverCustomerChats>{
    constructor(@InjectModel('drivercustomerchats') protected readonly model: Model<IDriverCustomerChats>) {
        super(model);
    }
}
