import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {ICustomerPaymentsInterface} from "../../data/interfaces/customerPayments.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class CustomerPaymentsService extends SimpleService<ICustomerPaymentsInterface>{
    constructor(@InjectModel('customerpayments') protected readonly model: Model<ICustomerPaymentsInterface>) {
        super(model);
    }
}
