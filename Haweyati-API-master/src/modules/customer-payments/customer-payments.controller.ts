import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {ICustomerPaymentsInterface} from "../../data/interfaces/customerPayments.interface";
import {CustomerPaymentsService} from "./customer-payments.service";

@Controller('customer-payments')
export class CustomerPaymentsController extends SimpleController<ICustomerPaymentsInterface>{
    constructor(protected readonly service: CustomerPaymentsService) {
        super(service);
    }
}
