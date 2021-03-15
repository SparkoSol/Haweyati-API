import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MulterModule } from '@nestjs/platform-express'
import { FinishingMaterialsService } from './finishing-materials.service'
import { ImageConversionUtils } from '../../common/lib/image-conversion-utils'
import { FinishingMaterialsController } from './finishing-materials.controller'
import { FinishingMaterialsSchema } from '../../data/schemas/finishingMaterials.schema'
import { ShopRegistrationModule } from '../shop-registration/shop-registration.module'
import { FinishingMaterialCategoryModule } from '../finishing-material-category/finishing-material-category.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'finishingmaterials', schema: FinishingMaterialsSchema }]),
    MulterModule.register({
      dest: ImageConversionUtils.imagePath
    }),
    ShopRegistrationModule,
    FinishingMaterialCategoryModule
  ],
  providers: [FinishingMaterialsService],
  controllers: [FinishingMaterialsController],
  exports: [FinishingMaterialsService]
})
export class FinishingMaterialsModule {
}
