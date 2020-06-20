import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IBuildingMaterialCategoriesInterface} from "../../data/interfaces/buildingMaterialCategories.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class BuildingMaterialCategoriesService extends SimpleService<IBuildingMaterialCategoriesInterface>{
    constructor(@InjectModel('buildingmaterialcategories') protected readonly model: Model<IBuildingMaterialCategoriesInterface>) {
        super(model);
    }
}
