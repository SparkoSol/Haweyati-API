import { IVehicleType } from '../../data/interfaces/vehicleType.interface'
import { ImageController } from '../../common/lib/image.controller'
import { VehicleTypeService } from './vehicle-type.service'
import { Controller } from '@nestjs/common'

@Controller('vehicle-type')
export class VehicleTypeController extends ImageController<IVehicleType> {
  constructor(protected readonly service: VehicleTypeService) {
    super(service)
  }
}
