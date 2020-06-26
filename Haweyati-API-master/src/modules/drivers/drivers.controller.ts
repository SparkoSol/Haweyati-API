import { Controller, Get, Param, Patch } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IDriversInterface} from "../../data/interfaces/drivers.interface";
import {DriversService} from "./drivers.service";
import { IDriverRequest } from '../../data/interfaces/driverRequest.interface';

@Controller('drivers')
export class DriversController extends SimpleController<IDriversInterface>{
    constructor(protected  readonly service: DriversService) {
        super(service);
    }
    @Get('getrequests')
    async getRequests(): Promise<IDriverRequest[]> {
        return this.service.getRequests();
    }

    @Patch('getverified/:id')
    async getVerified(@Param('id') id: string): Promise<any>{
        return this.service.getVerified(id);
    }

    @Patch('getrejected/:id')
        async getRejected(@Param('id') id: string): Promise<any>{
        return this.service.getRejected(id);
    }

    @Patch('getblocked/:id')
        async getBlocked(@Param('id') id: string): Promise<any>{
        return this.service.getBlocked(id);
    }

}