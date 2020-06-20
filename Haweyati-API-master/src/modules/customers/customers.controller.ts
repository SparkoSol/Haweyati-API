import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {ICustomerInterface} from "../../data/interfaces/customers.interface";
import {CustomersService} from "./customers.service";


@Controller('customers')
export class CustomersController extends SimpleController<ICustomerInterface>{
    constructor(protected readonly service: CustomersService) {
        super(service);
    }
}
