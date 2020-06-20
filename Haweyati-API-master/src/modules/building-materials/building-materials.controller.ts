import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IBuildingMaterialsInterface} from "../../data/interfaces/buildingMaterials.interface";
import {BuildingMaterialsService} from "./building-materials.service";

@Controller('building-materials')
export class BuildingMaterialsController extends SimpleController<IBuildingMaterialsInterface>{
    constructor(protected readonly service: BuildingMaterialsService) {
        super(service);
    }
}
