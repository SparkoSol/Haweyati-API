import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IFinishingMaterialCategoryInterface} from "../../data/interfaces/finishingMaterialCategory.interface";
import {FinishingMaterialCategoriesService} from "./finishing-material-categories.service";

@Controller('finishing-material-categories')
export class FinishingMaterialCategoriesController extends SimpleController<IFinishingMaterialCategoryInterface>{
    constructor(protected readonly service: FinishingMaterialCategoriesService) {
        super(service);
    }
}
