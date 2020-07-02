import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IScaffoldingsInterface} from "../../data/interfaces/scaffoldings.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { ShopRegistrationService } from '../shop-registration/shop-registration.service';
import { IDumpster } from '../../data/interfaces/dumpster.interface';

@Injectable()
export class ScaffoldingsService extends SimpleService<IScaffoldingsInterface> {
    constructor(
       @InjectModel('scaffoldings')
       protected readonly model: Model<IScaffoldingsInterface>,
       private readonly service: ShopRegistrationService
    ) {
        super(model);

    }
    fetch(id?: string): Promise<IScaffoldingsInterface[] | IScaffoldingsInterface> {
        if (id) return this.model.findById(id).populate('suppliers').exec()
        return this.model.find().exec()
    }
}