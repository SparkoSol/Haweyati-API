import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IRejectedDrivers} from "../../data/interfaces/rejectedDrivers.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class RejectedDriversService extends SimpleService<IRejectedDrivers>{
    constructor(@InjectModel('rejecteddrivers') protected readonly model: Model<IRejectedDrivers>) {
        super(model);
    }
}
