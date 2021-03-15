import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MulterModule } from '@nestjs/platform-express'
import { ImageConversionUtils } from '../../common/lib/image-conversion-utils'
import { BuildingMaterialCategoryService } from './building-material-category.service'
import { BuildingMaterialCategoryController } from './building-material-category.controller'
import { BuildingMaterialCategorySchema } from '../../data/schemas/buildingMaterialCategory.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'buildingmaterialcategory',
        schema: BuildingMaterialCategorySchema
      }
    ]),
    MulterModule.register({
      dest: ImageConversionUtils.imagePath
    })
  ],
  providers: [BuildingMaterialCategoryService],
  controllers: [BuildingMaterialCategoryController],
  exports: [BuildingMaterialCategoryService]
})
export class BuildingMaterialCategoryModule {
}
