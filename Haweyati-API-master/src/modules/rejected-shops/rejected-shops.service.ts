import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IRejectedShops} from "../../data/interfaces/rejectedShops.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class RejectedShopsService extends SimpleService<IRejectedShops>{
    constructor(@InjectModel('rejectedshops') protected readonly model: Model<IRejectedShops>) {
        super(model);
    }
}
