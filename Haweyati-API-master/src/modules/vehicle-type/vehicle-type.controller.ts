import { Controller } from '@nestjs/common'
import { VehicleTypeService } from './vehicle-type.service'
import { ImageController } from '../../common/lib/image.controller'
import { IVehicleType } from '../../data/interfaces/vehicleType.interface'

@Controller('vehicle-type')
export class VehicleTypeController extends ImageController<IVehicleType> {
  constructor(protected readonly service: VehicleTypeService) {
    super(service)
  }
}
