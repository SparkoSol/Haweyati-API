import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IRejectedDrivers} from "../../data/interfaces/rejectedDrivers.interface";
import {RejectedDriversService} from "./rejected-drivers.service";

@Controller('rejected-drivers')
export class RejectedDriversController extends SimpleController<IRejectedDrivers>{
    constructor(protected readonly service: RejectedDriversService) {
        super(service);
    }
}
