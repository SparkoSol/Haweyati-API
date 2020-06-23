import { Injectable } from '@nestjs/common';
import { SimpleService } from '../../common/lib/simple.service';
import { IBuildingMaterialCategory } from '../../data/interfaces/buildingMaterialCategory.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BuildingMaterialCategoryService extends SimpleService<IBuildingMaterialCategory>{
  constructor(@InjectModel('buildingmaterialcategory') protected readonly model: Model<IBuildingMaterialCategory>) {
    super(model);
  }


}
