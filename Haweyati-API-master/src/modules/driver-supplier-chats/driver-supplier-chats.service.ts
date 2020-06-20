import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IDriverSupplierChats} from "../../data/interfaces/driverSupplierChats.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class DriverSupplierChatsService extends SimpleService<IDriverSupplierChats>{
    constructor(@InjectModel('driversupplierchats') protected readonly model: Model<IDriverSupplierChats>) {
        super(model);
    }
}
