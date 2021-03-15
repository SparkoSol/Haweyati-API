import { ScaffoldingService } from './scaffolding.service'
import { Get, Param, Controller, Query, Headers } from "@nestjs/common";
import { ImageController } from '../../common/lib/image.controller'
import { IScaffolding } from '../../data/interfaces/scaffolding.interface'
import { IBuildingMaterials } from "../../data/interfaces/buildingMaterials.interface";

@Controller('scaffoldings')
export class ScaffoldingController extends ImageController<
  IScaffolding
> {
  constructor(protected readonly service: ScaffoldingService) {
    super(service)
  }

  @Get('new/:id')
  async new(
    @Param('id') id: string,
    @Query('withSuppliers') withSuppliers: boolean,
    @Headers('x-city') city: string
  ): Promise<IScaffolding[] | IScaffolding> {
    return this.service.new(id, withSuppliers, city)
  }

  @Get('new')
  async newAll(
    @Query('withSuppliers') withSuppliers: boolean,
    @Headers('x-city') city: string
  ): Promise<IScaffolding[] | IScaffolding> {
    return await this.service.new(null, withSuppliers, city)
  }

  @Get(':id')
  async getData(@Param('id') id: string, @Query('withSuppliers') withSuppliers: boolean): Promise<IScaffolding[] | IScaffolding> {
    return this.service.fetch(id, withSuppliers)
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
