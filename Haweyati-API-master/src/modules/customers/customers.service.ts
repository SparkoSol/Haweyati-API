import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {ICustomerInterface} from "../../data/interfaces/customers.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class CustomersService extends SimpleService<ICustomerInterface>{
    constructor(@InjectModel('customers') protected readonly model: Model<ICustomerInterface>) {
        super(model);
    }
}
