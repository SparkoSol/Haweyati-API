import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import {SimpleController} from "../../common/lib/simple.controller";
import {ICustomerInterface} from "../../data/interfaces/customers.interface";
import {CustomersService} from "./customers.service";

@Controller('customers')
export class CustomersController extends SimpleController<ICustomerInterface>{
   constructor(
      protected readonly service: CustomersService
   ) {
      super(service);
   }

   @Get('getblocked')
   async getAllBlocked(): Promise<any>{
      return await this.service.getBlocked();
   }

   @Patch('getblocked/:id')
   async getBlocked(@Param('id') id: string, @Body() message?: any): Promise<any>{
      if (message)
         return await this.service.getBlocked(id, message.message);
      else
         return await this.service.getBlocked(id);
   }

   @Patch('getunblocked/:id')
   async getUnblocked(@Param('id') id: string): Promise<any>{
      return await this.service.getUnblocked(id);
   }

}
