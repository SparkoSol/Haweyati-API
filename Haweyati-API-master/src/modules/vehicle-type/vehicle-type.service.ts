import { IVehicleType } from '../../data/interfaces/vehicleType.interface'
import { SimpleService } from '../../common/lib/simple.service'
import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'

@Injectable()
export class VehicleTypeService extends SimpleService<IVehicleType>{
  constructor(@InjectModel('vehicletype') protected readonly model: Model<IVehicleType>) {
    super(model);
  }

  create(document: IVehicleType): Promise<IVehicleType> {
    console.log(document)
    return super.create(document)
  }
}
