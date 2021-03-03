import { ReviewsService } from "./reviews.service";
import { Controller, Get, Query } from "@nestjs/common";
import { IReviews } from "../../data/interfaces/reviews.interface";
import { SimpleController } from "../../common/lib/simple.controller";

@Controller('reviews')
export class ReviewsController extends SimpleController<IReviews> {
  constructor(protected readonly service: ReviewsService) {
    super(service)
  }

  @Get()
  getReviews(@Query() data: any): Promise<IReviews[]> {
    return this.service.getReviews(data)
  }
}
