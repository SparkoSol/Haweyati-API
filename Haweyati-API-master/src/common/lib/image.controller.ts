import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { SimpleService } from './simple.service'
import { Document } from 'mongoose'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImageConversionUtils } from './image-conversion-utils'

export abstract class ImageController<T extends Document> {
  protected constructor(protected service: SimpleService<T>) {}

  @Get()
  getAll(): Promise<T | T[]> {
    return this.service.fetch()
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<T | T[]> {
    return this.service.fetch(id)
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async post(@UploadedFile() file, @Body() data: any): Promise<T> {
    if (file) {
      // @ts-ignore
      data.image = {
        name: file.filename,
        path: file.path
      }
    } else {
      // @ts-ignore
      data.image = undefined
    }

    const item = await this.service.create(data)
    if (file){
      await ImageConversionUtils.toWebp(process.cwd()+"\\"+data.image.path, process.cwd()+"\\..\\uploads\\"+data.image.name, 20)
    }
    return item
  }

  @Patch()
  @UseInterceptors(FileInterceptor('image'))
  async patch(@UploadedFile() file, @Body() data: any): Promise<T> {
    // @ts-ignore
    if (file) {
      // @ts-ignore
      data.image = {
        name: file.filename,
        path: file.path
      }
    }
    const item = await this.service.change(data)
    if (file){
      await ImageConversionUtils.toWebp(process.cwd()+"\\"+data.image.path, process.cwd()+"\\..\\uploads\\"+data.image.name, 20)
    }
    return item
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Document> {
    return this.service.remove(id)
  }
}
