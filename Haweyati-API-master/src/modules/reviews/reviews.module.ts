import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsSchema } from "../../data/schemas/reviews.schema";

@Module({
  imports: [MongooseModule.forFeature([{
    name: 'reviews', schema: ReviewsSchema
  }])],
  providers: [ReviewsService],
  controllers: [ReviewsController],
  exports: [ReviewsService]
})
export class ReviewsModule {}
