import { ScaffoldingService } from './scaffolding.service'
import { Get, Param, Controller, Query } from '@nestjs/common'
import { ImageController } from '../../common/lib/image.controller'
import { IScaffolding } from '../../data/interfaces/scaffolding.interface'

@Controller('scaffoldings')
export class ScaffoldingController extends ImageController<
  IScaffolding
> {
  constructor(protected readonly service: ScaffoldingService) {
    super(service)
  }

  @Get('getbysupplier/:id')
  async getBySupplier(@Param('id') id: string): Promise<IScaffolding[]> {
    return await this.service.getSuppliers(id)
  }

  @Get('available')
  async Get(@Query() data): Promise<IScaffolding[]> {
    return await this.service.getByCity(data.city)
  }
}
