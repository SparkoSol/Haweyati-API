import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {ICitiesInterface} from "../../data/interfaces/cities.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class CitiesService extends SimpleService<ICitiesInterface>{
    constructor(@InjectModel('cities') protected readonly model:Model<ICitiesInterface>) {
        super(model);
    }
}
