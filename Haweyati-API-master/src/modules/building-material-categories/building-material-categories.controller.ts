import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IBuildingMaterialCategoriesInterface} from "../../data/interfaces/buildingMaterialCategories.interface";
import {BuildingMaterialCategoriesService} from "./building-material-categories.service";

@Controller('building-material-categories')
export class BuildingMaterialCategoriesController extends SimpleController<IBuildingMaterialCategoriesInterface>{
    constructor(protected readonly service: BuildingMaterialCategoriesService) {
        super(service);
    }
}
