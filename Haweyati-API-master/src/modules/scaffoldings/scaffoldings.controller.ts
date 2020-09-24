import {
  Get,
  Param,
  Controller
} from '@nestjs/common'
import { ScaffoldingsService } from './scaffoldings.service'
import { SimpleController } from '../../common/lib/simple.controller'
import { IScaffoldingsInterface } from '../../data/interfaces/scaffoldings.interface'

@Controller('scaffoldings')
export class ScaffoldingsController extends SimpleController<
  IScaffoldingsInterface
> {
  constructor(protected readonly service: ScaffoldingsService) {
    super(service)
  }

  @Get('getbysupplier/:id')
  async getBySupplier(@Param('id') id: string): Promise<IScaffoldingsInterface>{
    return await this.service.getSuppliers(id)
  }

}
