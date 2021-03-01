import { Controller } from '@nestjs/common';
import { SimpleController } from "../../common/lib/simple.controller";
import { IReviews } from "../../data/interfaces/reviews.interface";
import { ReviewsService } from "./reviews.service";

@Controller('reviews')
export class ReviewsController extends SimpleController<IReviews>{
  constructor(protected readonly service: ReviewsService) {
    super(service);
  }
}
