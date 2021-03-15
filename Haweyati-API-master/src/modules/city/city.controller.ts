import { Controller } from '@nestjs/common'
import { CityService } from './city.service'
import { ICity } from '../../data/interfaces/city.interface'
import { SimpleController } from '../../common/lib/simple.controller'

@Controller('city')
export class CityController extends SimpleController<ICity> {
  constructor(protected readonly service: CityService) {
    super(service)
  }
}
