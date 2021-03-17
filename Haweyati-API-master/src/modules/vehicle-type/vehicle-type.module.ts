import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MulterModule } from '@nestjs/platform-express'
import { VehicleTypeService } from './vehicle-type.service'
import { VehicleTypeController } from './vehicle-type.controller'
import { VehicleTypeSchema } from '../../data/schemas/vehicleType.schema'
import { ImageConversionUtils } from '../../common/lib/image-conversion-utils'

@Module({
  imports: [
    MongooseModule.forFeature(
      [{name: 'vehicletype', schema: VehicleTypeSchema}]
    ),
    MulterModule.register({
      dest: ImageConversionUtils.imagePath
    })],
  exports: [VehicleTypeService],
  providers: [VehicleTypeService],
  controllers: [VehicleTypeController]
})
export class VehicleTypeModule {}
