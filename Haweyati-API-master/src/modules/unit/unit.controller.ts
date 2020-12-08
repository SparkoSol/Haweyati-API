import { Controller } from '@nestjs/common'
import { UnitService } from './unit.service'
import { IUnit } from '../../data/interfaces/unit.interface'
import { SimpleController } from '../../common/lib/simple.controller'

@Controller('unit')
export class UnitController extends SimpleController<IUnit>{
  constructor(protected readonly service: UnitService) {
    super(service);
  }
}
