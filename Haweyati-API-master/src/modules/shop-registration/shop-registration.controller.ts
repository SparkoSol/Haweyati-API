import {
   Body,
   Controller,
   Patch,
   Post,
   UseInterceptors,
   Get,
   Param,
   Res,
   UploadedFile, HttpException, HttpStatus,
} from '@nestjs/common';
import {IShopRegistrationInterface} from "../../data/interfaces/shopRegistration.interface";
import {ShopRegistrationService} from "./shop-registration.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImageController } from "../../common/lib/image.controller";

@Controller('suppliers')
export class ShopRegistrationController extends ImageController<IShopRegistrationInterface>{
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
   @UseInterceptors(FileInterceptor('image'))
   async Post(@UploadedFile() image, @Body() data: any) {
      console.log(image)
      data.image = {
         name : image.filename,
         path : image.path
      }
      console.log(data.image)
      data.city = 'Multan'
      data.username = data.contact


      const person = await this.service.addProfile(data);

      if (person) {
         data.location = {
            latitude: 30.1575,
            longitude : 71.5249,
            address: data.address
         }
         data.person = person._id;
         data.image = null


         //TODO: Uncomment after implementation of maps on admin panel
         // data.location = {
         //    latitude: data.latitude,
         //    longitude : data.longitude,
         //    address: data.address
         // }
         // data.city = data.city

         data.username = undefined;
         console.log(data)
         return super.post(image , data);
      } else {
         throw new HttpException("Contact Already exists", HttpStatus.NOT_ACCEPTABLE)
      }
   }

   @Patch('getapproved/:id')
   getApproved(@Param('id') id: string): Promise<any>{
      return this.service.getApproved(id);
   }

   @Patch()
   @UseInterceptors(FileInterceptor('image'))
   Patch(@UploadedFile() image, @Body() data: any): Promise<IShopRegistrationInterface>{
      return super.patch(image, data);
   }

   @Get('report')
   async report(@Res() res) {
      (await this.service.generateReport()).pipe(res);
   }

}