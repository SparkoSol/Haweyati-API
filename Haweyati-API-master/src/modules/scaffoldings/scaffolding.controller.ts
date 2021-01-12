import { ScaffoldingService } from './scaffolding.service'
import { Get, Param, Controller, Query } from '@nestjs/common'
import { ImageController } from '../../common/lib/image.controller'
import { IScaffoldingInterface } from '../../data/interfaces/scaffolding.interface'

@Controller('scaffoldings')
export class ScaffoldingController extends ImageController<
  IScaffoldingInterface
> {
  constructor(protected readonly service: ScaffoldingService) {
    super(service)
  }

  @Get('getbysupplier/:id')
  async getBySupplier(@Param('id') id: string): Promise<IScaffoldingInterface> {
    return await this.service.getSuppliers(id)
  }

  @Get('available')
  async Get(@Query() data): Promise<any> {
    return await this.service.getByCity(data.city)
  }
}
