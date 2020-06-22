import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IBuildingMaterialsInterface} from "../../data/interfaces/buildingMaterials.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { ShopRegistrationService } from '../shop-registration/shop-registration.service';

@Injectable()
export class BuildingMaterialsService extends SimpleService<IBuildingMaterialsInterface>{
    constructor(
      @InjectModel('buildingmaterials')
      protected readonly model: Model<IBuildingMaterialsInterface>,
      private readonly service: ShopRegistrationService
    ) {
        super(model);
    }
    fetch(id?: string): Promise<IBuildingMaterialsInterface[] | IBuildingMaterialsInterface> {
        if (id) return this.model.findById(id).populate('suppliers').exec()
        return this.model.find().exec()
    }

}
