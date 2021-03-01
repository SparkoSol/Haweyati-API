import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { UnitService } from './unit.service'
import { IUnit } from '../../data/interfaces/unit.interface'
import { SimpleController } from '../../common/lib/simple.controller'

@Controller('unit')
export class UnitController extends SimpleController<IUnit>{
  constructor(protected readonly service: UnitService) {
    super(service);
  }

  @Get('point-value')
  async getValue(): Promise<number> {
    return await this.service.getValue()
  }

  @Get(':/id')
  async get(@Param('id') id: string): Promise<IUnit>{
    return await this.service.fetch(id) as IUnit
  }

  @Post('add-point-value')
  async addValue(@Body() data: any): Promise<number> {
    return await this.service.addValue(data.value)
  }

  @Patch('update-point-value')
  async updateValue(@Body() data: any): Promise<number> {
    return await this.service.updateValue(data.value)
  }
}
