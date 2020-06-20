import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {ICitiesInterface} from "../../data/interfaces/cities.interface";
import {CitiesService} from "./cities.service";

@Controller('cities')
export class CitiesController extends SimpleController<ICitiesInterface>{
    constructor(protected readonly service: CitiesService) {
        super(service);
    }
}
