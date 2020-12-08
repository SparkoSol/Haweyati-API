import { SimpleController } from "../../common/lib/simple.controller";
import { ICity } from "../../data/interfaces/city.interface";
import { CityService } from "./city.service";
import { Controller } from "@nestjs/common";

@Controller('city')
export class CityController extends SimpleController<ICity> {
  constructor(protected readonly service: CityService) {
    super(service)
  }
}
