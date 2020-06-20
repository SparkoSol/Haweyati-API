import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IOrderDriversInterface} from "../../data/interfaces/orderDrivers.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class OrderDriversService extends SimpleService<IOrderDriversInterface>{
    constructor(@InjectModel('orderdrivers') protected readonly model: Model<IOrderDriversInterface>) {
        super(model);
    }
}
