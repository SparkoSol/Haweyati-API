import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MulterModule } from '@nestjs/platform-express'
import { BuildingMaterialsService } from './building-materials.service'
import { BuildingMaterialsController } from './building-materials.controller'
import { ImageConversionUtils } from '../../common/lib/image-conversion-utils'
import { BuildingMaterialsSchema } from '../../data/schemas/buildingMaterials.schema'
import { ShopRegistrationModule } from '../shop-registration/shop-registration.module'
import { BuildingMaterialCategoryModule } from '../building-material-category/building-material-category.module'
import { BuildingMaterialSubCategoryModule } from '../building-material-sub-category/building-material-sub-category.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'buildingmaterials', schema: BuildingMaterialsSchema }]),
    MulterModule.register({
      dest: ImageConversionUtils.imagePath
    }),
    ShopRegistrationModule,
    BuildingMaterialCategoryModule,
    BuildingMaterialSubCategoryModule
  ],
  controllers: [BuildingMaterialsController],
  providers: [BuildingMaterialsService],
  exports: [BuildingMaterialsService]
})
export class BuildingMaterialsModule {
}
