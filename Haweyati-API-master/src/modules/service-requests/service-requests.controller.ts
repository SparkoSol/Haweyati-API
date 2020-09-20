import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import {IServicesRequests} from "../../data/interfaces/serviceRequests.interface";
import {ServiceRequestsService} from "./service-requests.service";
import { ImageController } from '../../common/lib/image.controller'

@Controller('service-requests')
export class ServiceRequestsController extends ImageController<IServicesRequests>{
  constructor(
    protected readonly service: ServiceRequestsService
  ) {
    super(service);
  }

  @Get('pending')
  async pending(): Promise<any>{
    return await this.service.getByStatus('Pending');
  }

  @Get('rejected')
  async rejectedData(): Promise<any>{
    return await this.service.getByStatus('Rejected');
  }

  @Patch('rejected/:id')
  async rejected(@Param('id') id: string) : Promise<any>{
    return await this.service.updateByStatus(id, 'Rejected');
  }

  @Get('completed')
  async completedData(): Promise<any>{
    return await this.service.getByStatus('Completed');
  }

  @Patch('completed/:id')
  async completed(@Param('id') id: string) : Promise<any>{
    return await this.service.updateByStatus(id, 'Completed');
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
