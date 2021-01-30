import { IVehicleType } from "../../data/interfaces/vehicleType.interface";
import { SimpleService } from "../../common/lib/simple.service";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

@Injectable()
export class VehicleTypeService extends SimpleService<IVehicleType>{
  constructor(@InjectModel("vehicletype") protected readonly model: Model<IVehicleType>) {
    super(model);
  }

  async findClosestVehicle(volumetricWeight: number, cbm: number): Promise<any>{
    const vehicles = await this.model
      .find({volumetricWeight : {$gt: volumetricWeight}})
      .sort({volumetricWeight: -1})
      .exec();
    for (const vehicle of vehicles) {
      if ((vehicle.cbmHeight * vehicle.cbmLength * vehicle.cbmWidth) > cbm) {
        return vehicle;
      }
    }
  }
}
