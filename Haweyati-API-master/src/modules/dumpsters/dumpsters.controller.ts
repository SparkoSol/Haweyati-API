import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  Get,
  Query,
  Param,
  Delete,
  UploadedFile,
  Patch
} from '@nestjs/common'
import { DumpstersService } from './dumpsters.service'
import { IDumpster } from '../../data/interfaces/dumpster.interface'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImageController } from '../../common/lib/image.controller'

@Controller('dumpsters')
export class DumpstersController extends ImageController<IDumpster> {
  constructor(protected readonly service: DumpstersService) {
    super(service)
  }

  private parseData(dumpster: any): any {
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
  postOverride(@UploadedFile() file, @Body() dumpster: any) {
    return super.post(file, this.parseData(dumpster))
  }

  @Patch()
  @UseInterceptors(FileInterceptor('image'))
  patch(@UploadedFile() file, @Body() dumpster: any) {
    return super.patch(file, this.parseData(dumpster))
  }

  @Get('available')
  async Get(@Query() data): Promise<any> {
    return await this.service.getByCity(data.city)
  }

  @Get('fromsuppliers/:id')
  async getFromSupplier(@Param('id') id: string): Promise<any> {
    return await this.service.fromSuppliers(id)
  }

  @Delete(':/id')
  async deleteDumpster(@Param('id') id: string): Promise<any> {
    return await this.service.remove(id)
  }

  // @Patch('deleteimage')
  // async imageDelete(@Body() data: any): Promise<any>{
  //    return await this.service.deleteImage(data);
  // }
}
