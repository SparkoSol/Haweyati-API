import { Body, Controller, Patch, Post, UploadedFiles, UseInterceptors, Get, Param, Query, Res } from "@nestjs/common";
import {SimpleController} from "../../common/lib/simple.controller";
import {IShopRegistrationInterface} from "../../data/interfaces/shopRegistration.interface";
import {ShopRegistrationService} from "./shop-registration.service";
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('suppliers')
export class ShopRegistrationController extends SimpleController<IShopRegistrationInterface>{
   constructor(
      protected readonly service: ShopRegistrationService
   ) {
      super(service);
   }

   @Get('pending')
   getPending(): Promise<IShopRegistrationInterface[]>{
      return this.service.getPendingSuppliers();
   }

   @Get('available/:city')
   async Get(@Param('city') city: string): Promise<any>{
      return this.service.getDataFromCity(city);
   }

   @Get('getbyservice/:name')
   async getByService(@Param('name') name: string): Promise<any>
   {
      return await this.service.getByService(name);
   }

   @Get('all')
   async all(): Promise<IShopRegistrationInterface[]>{
      return await this.service.fetchAll();
   }

   @Get('getrejected')
   async getAllRejected(): Promise<any>{
      return await this.service.getRejected();
   }

   @Patch('getrejected/:id')
   async getRejected(@Param('id') id: string): Promise<any>{
      return await this.service.getRejected(id);
   }

   @Get('getsubsuppliers/:id')
   async subSuppliers(@Param('id') id: string): Promise<any>{
      return this.service.getSubsuppliers(id);
   }

   @Post()
   @UseInterceptors(FilesInterceptor('images'))
   Post(@UploadedFiles() images, @Body() data: any): Promise<IShopRegistrationInterface> {
      data.images = images.map(file => ({
         name: file.filename,
         path: file.path
      }))
      data.username = data.contact
      return super.post(data);
   }

   @Patch('getapproved/:id')
   getApproved(@Param('id') id: string): Promise<any>{
      return this.service.getApproved(id);
   }

   @Patch()
   @UseInterceptors(FilesInterceptor('images'))
   Patch(@UploadedFiles() images, @Body() data: any): Promise<IShopRegistrationInterface>{
      data.images.push(images);
      return super.patch(data);
   }

   @Get('report')
   async report(@Res() res) {
      (await this.service.generateReport()).pipe(res);
   }

}