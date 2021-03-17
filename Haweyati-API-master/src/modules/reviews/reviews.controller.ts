import { ReviewsService } from './reviews.service'
import { Controller, Get, Query } from '@nestjs/common'
import { IReview } from '../../data/interfaces/reviews.interface'
import { SimpleController } from '../../common/lib/simple.controller'

@Controller('reviews')
export class ReviewsController extends SimpleController<IReview> {
  constructor(protected readonly service: ReviewsService) {
    super(service)
  }

  @Get()
  getReviews(@Query() data: any): Promise<IReview[]> {
    return this.service.getReviews(data)
  }
}
