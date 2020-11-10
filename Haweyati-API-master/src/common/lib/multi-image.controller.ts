import { Body, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { SimpleService } from './simple.service'
import { Document } from 'mongoose'
import { FilesInterceptor } from "@nestjs/platform-express";
import * as fs from 'fs'

export abstract class MultiImageController<T extends Document> {
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
   @UseInterceptors(FilesInterceptor('images'))
   post(@UploadedFiles() files, @Body() data: T): Promise<T> {
      // @ts-ignore
      data.images = files.map(file => ({
         name: file.filename,
         path: file.path
      }))
      return this.service.create(data)
   }

   @Patch()
   @UseInterceptors(FilesInterceptor('images'))
   patch(@UploadedFiles() files, @Body() data: T): Promise<T> {
      let newData = this.deleteImage(data);
      // @ts-ignore
      newData.images.push(files.map(file => ({
         name: file.filename,
         path: file.path
      })))
      return this.service.change(data)
   }

   deleteImage(@Body() data: any): Promise<T>{
      // @ts-ignore
      for (let i=0;i<data.index.length; ++i){
         // @ts-ignore
         if (data.images[i].name == data.index[i]){
            // @ts-ignore
            data.images.splice(i, 1);
            // @ts-ignore
            fs.unlinkSync(data.images[i].path)
         }
      }
      return data;

   }

   @Delete(':id')
   delete(@Param('id') id: string): Promise<Document> {
      return this.service.remove(id)
   }
}
