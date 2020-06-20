import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IRejectedShops} from "../../data/interfaces/rejectedShops.interface";
import {RejectedShopsService} from "./rejected-shops.service";

@Controller('rejected-shops')
export class RejectedShopsController extends SimpleController<IRejectedShops>{
    constructor(protected readonly service: RejectedShopsService) {
        super(service);
    }
}
