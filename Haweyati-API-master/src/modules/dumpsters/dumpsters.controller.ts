import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { DumpstersService } from './dumpsters.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImageController } from '../../common/lib/image.controller'
import { IDumpster } from '../../data/interfaces/dumpster.interface'
import { dtoDumpster, dtoDumpsterQuery } from '../../data/dtos/dumpster.dto'

@Controller('dumpsters')
export class DumpstersController extends ImageController<IDumpster> {
  constructor(protected readonly service: DumpstersService) {
    super(service)
  }

  @Get('new/:id')
  async new(
    @Param('id') id: string,
    @Query('withSuppliers') withSuppliers: boolean,
    @Headers('x-city') city: string
  ): Promise<IDumpster[] | IDumpster> {
    return this.service.new(id, withSuppliers, city)
  }

  @Get('new')
  async newAll(
    @Query('withSuppliers') withSuppliers: boolean,
    @Headers('x-city') city: string
  ): Promise<IDumpster[] | IDumpster> {
    return await this.service.new(null, withSuppliers, city)
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<IDumpster[] | IDumpster> {
    return await this.service.fetch(id)
  }

  @Get()
  async getAll(): Promise<IDumpster[] | IDumpster> {
    return await this.service.fetch()
  }

  @Get('available')
  async Get(@Query() data: dtoDumpsterQuery): Promise<IDumpster[]> {
    return await this.service.getByCity(data.city)
  }

  @Get(':id')
  async getData(
    @Param('id') id: string,
    @Query('withSuppliers') withSuppliers: boolean
  ): Promise<IDumpster[] | IDumpster> {
    return this.service.fetch(id, withSuppliers)
  }

  protected parseData(dumpster: dtoDumpster): any {
    if (Array.isArray(dumpster.city)) {
      const list = []
      for (let i = 0; i < dumpster.city.length; ++i) {
        list.push({
          city: dumpster.city[i],
          rent: dumpster.rent[i],
          days: dumpster.days[i],
          extraDayRent: dumpster.extraDayRent[i],
          helperPrice: dumpster.helperPrice[i]
        })
      }
      dumpster.pricing = list
    } else {
      dumpster.pricing = [
        {
          city: dumpster.city,
          rent: dumpster.rent,
          days: dumpster.days,
          extraDayRent: dumpster.extraDayRent,
          helperPrice: dumpster.helperPrice
        }
      ]
    }

    return dumpster
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  postOverride(
    @UploadedFile() file,
    @Body() dumpster: dtoDumpster
  ): Promise<IDumpster> {
    if (!file)
      throw new HttpException('Image is Required!', HttpStatus.NOT_ACCEPTABLE)
    return super.post(file, this.parseData(dumpster))
  }

  @Patch()
  @UseInterceptors(FileInterceptor('image'))
  patch(
    @UploadedFile() file,
    @Body() dumpster: dtoDumpster
  ): Promise<IDumpster> {
    return super.patch(file, this.parseData(dumpster))
  }

  @Get('fromsuppliers/:id')
  async getFromSupplier(@Param('id') id: string): Promise<IDumpster[]> {
    return await this.service.fromSuppliers(id)
  }

  @Delete(':/id')
  async deleteDumpster(@Param('id') id: string): Promise<IDumpster> {
    return await this.service.remove(id)
  }
}
