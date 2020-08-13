import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import {SimpleController} from "../../common/lib/simple.controller";
import {IServicesRequests} from "../../data/interfaces/serviceRequests.interface";
import {ServiceRequestsService} from "./service-requests.service";

@Controller('service-requests')
export class ServiceRequestsController extends SimpleController<IServicesRequests>{
  constructor(
    protected readonly service: ServiceRequestsService
  ) {
    super(service);
  }

  @Post()
  async postOverride(@Body() data: any){
    return await this.service.create(data);
  }

  @Get('pending')
  async pending(): Promise<any>{
    return await this.service.Pending();
  }

  @Get('rejected')
  async rejectedData(): Promise<any>{
    return await this.service.Rejected();
  }

  @Patch('rejected/:id')
  async rejected(@Param('id') id: string) : Promise<any>{
    return await this.service.Rejected(id);
  }

  @Get('completed')
  async completedData(): Promise<any>{
    return await this.service.Completed();
  }

  @Patch('completed/:id')
  async completed(@Param('id') id: string) : Promise<any>{
    return await this.service.Completed(id);
  }

  @Get('getBySupplier/:id')
  async getBySuppliers(@Param('id') id: string): Promise<any>{
    return await this.service.getBySupplier(id);
  }

  @Get('search')
  async search(@Query() query:string){
    return await this.service.search(query)
  }
}
