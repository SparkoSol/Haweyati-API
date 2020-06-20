import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IDriversInterface} from "../../data/interfaces/drivers.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class DriversService extends SimpleService<IDriversInterface>{
    constructor(@InjectModel('drivers') protected readonly model: Model<IDriversInterface>) {
        super(model);
    }
}
