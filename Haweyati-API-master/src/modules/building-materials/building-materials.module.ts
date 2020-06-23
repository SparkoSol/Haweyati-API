import { HttpModule, Module } from '@nestjs/common';
import { BuildingMaterialsController } from './building-materials.controller';
import { BuildingMaterialsService } from './building-materials.service';
import {MongooseModule} from "@nestjs/mongoose";
import {BuildingMaterialsSchema} from "../../data/schemas/buildingMaterials.schema";
import { MulterModule } from '@nestjs/platform-express';
import { ShopRegistrationModule } from '../shop-registration/shop-registration.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name:'buildingmaterials', schema: BuildingMaterialsSchema}]),
    MulterModule.register({
      dest: '../uploads',
    }),
    ShopRegistrationModule
  ],
  controllers: [BuildingMaterialsController],
  providers: [BuildingMaterialsService],
  exports: [BuildingMaterialsService]
})
export class BuildingMaterialsModule {}
