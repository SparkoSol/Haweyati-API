import { ReviewsService } from "./reviews.service";
import { Controller, Get, Param } from "@nestjs/common";
import { IReviews } from "../../data/interfaces/reviews.interface";
import { SimpleController } from "../../common/lib/simple.controller";

@Controller('reviews')
export class ReviewsController extends SimpleController<IReviews>{
  constructor(protected readonly service: ReviewsService) {
    super(service);
  }

  @Get('customer:/id')
  async getFromCustomer(@Param('id') id: string): Promise<IReviews[]>{
    return await this.service.getFromCustomer(id)
  }

  @Get('supplier:/id')
  async getFromSupplier(@Param('id') id: string): Promise<IReviews[]>{
    return await this.service.getFromSupplier(id)
  }

  @Get('driver:/id')
  async getFromDriver(@Param('id') id: string): Promise<IReviews[]>{
    return await this.service.getFromDriver(id)
  }

  @Get('order:/id')
  async getFromOrder(@Param('id') id: string): Promise<IReviews[]>{
    return await this.service.getFromOrder(id)
  }

  @Get(':/id')
  async get(@Param('id') id): Promise<IReviews>{
    return await this.service.fetch(id) as IReviews
  }
}
