import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SimpleService } from "../../common/lib/simple.service";
import { IReview } from "../../data/interfaces/reviews.interface";

@Injectable()
export class ReviewsService extends SimpleService<IReview> {
  constructor(
    @InjectModel('reviews')
    protected readonly model: Model<IReview>
  ) {
    super(model)
  }

  async getReviews(data: any): Promise<IReview[]>{
    switch (data.type){
      case 'customer':
        return await this.model
          .find({ customer: data.id })
          .populate({
            path: 'customer',
            model: 'customers',
            populate: {
              path: 'profile',
              model: 'persons'
            }
          })
          .populate({
            path: 'supplier',
            model: 'shopregistration',
            populate: {
              path: 'person',
              model: 'persons'
            }
          })
          .populate({
            path: 'driver',
            model: 'drivers',
            populate:
              {
                path: 'profile',
                model: 'persons',
              }
          })
          .sort({ createdAt: -1 })
          .exec()
      case 'supplier':
        return await this.model
          .find({ supplier: data.id })
          .populate({
            path: 'customer',
            model: 'customers',
            populate: {
              path: 'profile',
              model: 'persons'
            }
          })
          .populate({
            path: 'supplier',
            model: 'shopregistration',
            populate: {
              path: 'person',
              model: 'persons'
            }
          })
          .populate({
            path: 'driver',
            model: 'drivers',
            populate: {
              path: 'profile',
              model: 'persons'
            }
          })
          .sort({ createdAt: -1 })
          .exec()
      case 'driver':
        return await this.model
          .find({ driver: data.id })
          .populate({
            path: 'customer',
            model: 'customers',
            populate: {
              path: 'profile',
              model: 'persons'
            }
          })
          .populate({
            path: 'supplier',
            model: 'shopregistration',
            populate: {
              path: 'person',
              model: 'persons'
            }
          })
          .populate({
            path: 'driver',
            model: 'drivers',
            populate: {
              path: 'profile',
              model: 'persons'
            }
          })
          .sort({ createdAt: -1 })
          .exec()
      case 'order':
        return await this.model
          .find({ order: data.id })
          .populate({
            path: 'customer',
            model: 'customers',
            populate: {
              path: 'profile',
              model: 'persons'
            }
          })
          .populate({
            path: 'supplier',
            model: 'shopregistration',
            populate: {
              path: 'person',
              model: 'persons'
            }
          })
          .populate({
            path: 'driver',
            model: 'drivers',
            populate: {
              path: 'profile',
              model: 'persons'
            }
          })
          .sort({ createdAt: -1 })
          .exec()
    }
  }
}
