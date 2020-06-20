import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IBuildingMaterialsInterface} from "../../data/interfaces/buildingMaterials.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class BuildingMaterialsService extends SimpleService<IBuildingMaterialsInterface>{
    constructor(@InjectModel('buildingmaterials') protected readonly model: Model<IBuildingMaterialsInterface>) {
        super(model);
    }
}
