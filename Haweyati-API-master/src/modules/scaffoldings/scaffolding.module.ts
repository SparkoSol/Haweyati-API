import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MulterModule } from '@nestjs/platform-express'
import { ScaffoldingService } from './scaffolding.service'
import { ScaffoldingController } from './scaffolding.controller'
import { ScaffoldingSchema } from '../../data/schemas/scaffoldingSchema'
import { ImageConversionUtils } from '../../common/lib/image-conversion-utils'
import { ShopRegistrationModule } from '../shop-registration/shop-registration.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'scaffoldings', schema: ScaffoldingSchema }]),
    MulterModule.register({
      dest: ImageConversionUtils.imagePath
    }),
    ShopRegistrationModule
  ],
  providers: [ScaffoldingService],
  controllers: [ScaffoldingController],
  exports: [ScaffoldingService]
})
export class ScaffoldingModule {
}
