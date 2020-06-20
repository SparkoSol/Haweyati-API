import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IScaffoldingsInterface} from "../../data/interfaces/scaffoldings.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class ScaffoldingsService extends SimpleService<IScaffoldingsInterface>{
    constructor(@InjectModel('scaffoldings') protected readonly model: Model<IScaffoldingsInterface>) {
        super(model);
    }
}
