import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IFinishingMaterialsInterface} from "../../data/schemas/finishingMaterials.interface";
import {FinishingMaterialsService} from "./finishing-materials.service";

@Controller('finishing-materials')
export class FinishingMaterialsController extends SimpleController<IFinishingMaterialsInterface>{
    constructor(protected readonly service: FinishingMaterialsService) {
        super(service);
    }
}
