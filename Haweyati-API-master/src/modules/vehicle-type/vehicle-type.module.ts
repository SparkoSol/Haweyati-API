import { ImageConversionUtils } from '../../common/lib/image-conversion-utils'
import { VehicleTypeSchema } from '../../data/schemas/vehicleType.schema'
import { VehicleTypeController } from './vehicle-type.controller'
import { VehicleTypeService } from './vehicle-type.service'
import { MulterModule } from '@nestjs/platform-express'
import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'

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
