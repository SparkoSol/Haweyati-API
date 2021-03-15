import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DumpstersService } from './dumpsters.service'
import { MulterModule } from '@nestjs/platform-express'
import { DumpstersController } from './dumpsters.controller'
import { DumpstersSchema } from '../../data/schemas/dumpsters.schema'
import { ImageConversionUtils } from '../../common/lib/image-conversion-utils'
import { ShopRegistrationModule } from '../shop-registration/shop-registration.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'dumpsters',
        schema: DumpstersSchema
      }
    ]),
    MulterModule.register({
      dest: ImageConversionUtils.imagePath
    }),
    ShopRegistrationModule
  ],
  controllers: [DumpstersController],
  providers: [DumpstersService]
})
export class DumpstersModule {
}

