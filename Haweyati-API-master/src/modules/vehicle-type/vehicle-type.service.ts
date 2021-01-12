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

  async findClosestVehicle(volumetricVolume: number): Promise<any>{
    return await this.model.find({volumetricWeight : {$gt: volumetricVolume}}).sort({volumetricWeight: -1}).limit(1).exec()
  }
}
