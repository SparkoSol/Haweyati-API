import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MulterModule } from '@nestjs/platform-express'
import { ImageConversionUtils } from '../../common/lib/image-conversion-utils'
import { BuildingMaterialSubCategoryService } from './building-material-sub-category.service'
import { BuildingMaterialSubCategoryController } from './building-material-sub-category.controller'
import { BuildingMaterialSubCategorySchema } from '../../data/schemas/buildingMaterialSubCategory.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'buildingmaterialsubcategories',
        schema: BuildingMaterialSubCategorySchema
      }
    ]),
    MulterModule.register({
      dest: ImageConversionUtils.imagePath
    })
  ],
  providers: [BuildingMaterialSubCategoryService],
  controllers: [BuildingMaterialSubCategoryController],
  exports: [BuildingMaterialSubCategoryService]
})
export class BuildingMaterialSubCategoryModule {}
