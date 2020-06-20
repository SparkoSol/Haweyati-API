import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IFinishingMaterialCategoryInterface} from "../../data/interfaces/finishingMaterialCategory.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class FinishingMaterialCategoriesService extends SimpleService<IFinishingMaterialCategoryInterface>{
    constructor(@InjectModel('finishingmaterialcategories') protected readonly model: Model<IFinishingMaterialCategoryInterface>) {
        super(model);
    }
}
