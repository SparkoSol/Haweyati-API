import { Document } from 'mongoose'
import { AuthGuard } from '@nestjs/passport'
import { SimpleService } from './simple.service'
import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common'

export class SecuredController<T extends Document> {
  protected constructor(protected service: SimpleService<T>) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getAll(): Promise<T | T[]> {
    return this.service.fetch()
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  get(@Param('id') id: string): Promise<T | T[]> {
    return this.service.fetch(id)
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  post(@Body() data: T): Promise<T> {
    return this.service.create(data)
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  patch(@Body() data: T): Promise<T> {
    return this.service.change(data)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string): Promise<Document> {
    return this.service.remove(id)
  }
}
