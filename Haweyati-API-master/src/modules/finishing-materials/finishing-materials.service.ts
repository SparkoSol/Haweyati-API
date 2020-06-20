import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IFinishingMaterialsInterface} from "../../data/schemas/finishingMaterials.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class FinishingMaterialsService extends SimpleService<IFinishingMaterialsInterface>{
    constructor(@InjectModel('finishingmaterials') protected readonly model: Model<IFinishingMaterialsInterface>) {
        super(model);
    }
}
