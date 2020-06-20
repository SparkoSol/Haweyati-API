import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IDriversInterface} from "../../data/interfaces/drivers.interface";
import {DriversService} from "./drivers.service";

@Controller('drivers')
export class DriversController extends SimpleController<IDriversInterface>{
    constructor(protected  readonly service: DriversService) {
        super(service);
    }
}
