import {MongooseModule} from "@nestjs/mongoose";
import { HttpModule, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { BuildingMaterialsService } from './building-materials.service';
import { BuildingMaterialsController } from './building-materials.controller';
import {BuildingMaterialsSchema} from "../../data/schemas/buildingMaterials.schema";
import { ShopRegistrationModule } from '../shop-registration/shop-registration.module';
import { BuildingMaterialCategoryModule } from "../building-material-category/building-material-category.module";

@Module({
  imports: [
    MongooseModule.forFeature([{name:'buildingmaterials', schema: BuildingMaterialsSchema}]),
    MulterModule.register({
      dest: '../uploads',
    }),
    ShopRegistrationModule,
    BuildingMaterialCategoryModule
  ],
  controllers: [BuildingMaterialsController],
  providers: [BuildingMaterialsService],
  exports: [BuildingMaterialsService]
})
export class BuildingMaterialsModule {}
