import { UnitService } from './unit.service'
import { IUnit } from '../../data/interfaces/unit.interface'
import { Body, Controller, Get, Param, Patch } from '@nestjs/common'
import { SimpleController } from '../../common/lib/simple.controller'
import { IPointValue } from '../../data/interfaces/pointValue.interface'

@Controller('unit')
export class UnitController extends SimpleController<IUnit> {
  constructor(protected readonly service: UnitService) {
    super(service)
  }

  @Get('point-value')
  async getValue(): Promise<IPointValue> {
    return await this.service.getValue()
  }

  @Get(':/id')
  async get(@Param('id') id: string): Promise<IUnit> {
    return (await this.service.fetch(id)) as IUnit
  }

  @Patch('update-point-value')
  async updateValue(@Body() data: IPointValue): Promise<IPointValue> {
    return await this.service.updateValue(data)
  }
}
