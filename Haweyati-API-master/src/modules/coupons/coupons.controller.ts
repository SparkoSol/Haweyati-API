import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {ICouponsInterface} from "../../data/interfaces/coupons.interface";
import {CouponsService} from "./coupons.service";

@Controller('coupons')
export class CouponsController extends SimpleController<ICouponsInterface>{
    constructor(protected readonly service: CouponsService) {
        super(service);
    }
}
