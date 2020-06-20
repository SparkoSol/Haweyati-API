import { Body, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { SimpleService } from './simple.service'
import { Document } from 'mongoose'

/**
 * @template T
 * @author Arish Khan <arishsultan104@gmail.com>
 */
export abstract class SimpleController<T extends Document> {
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
  post(@Body() data: T): Promise<T> {
    return this.service.create(data)
  }

  @Patch()
  patch(@Body() data: T): Promise<T> {
    return this.service.change(data)
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Document> {
    return this.service.remove(id)
  }
}
