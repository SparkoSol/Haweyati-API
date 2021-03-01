import { Model } from "mongoose";
import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { SimpleService } from "../../common/lib/simple.service";
import { IReviews } from "../../data/interfaces/reviews.interface";

@Injectable()
export class ReviewsService extends SimpleService<IReviews>{
  constructor(
    @InjectModel('reviews') protected readonly model: Model<IReviews>
  ) {
    super(model);
  }

}
