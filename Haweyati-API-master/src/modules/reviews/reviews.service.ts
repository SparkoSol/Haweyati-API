import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SimpleService } from "../../common/lib/simple.service";
import { IReviews } from "../../data/interfaces/reviews.interface";

@Injectable()
export class ReviewsService extends SimpleService<IReviews> {
  constructor(
    @InjectModel('reviews') protected readonly model: Model<IReviews>
  ) {
    super(model)
  }

  create(document: IReviews): Promise<IReviews> {
    console.log(document)
    return super.create(document)
  }

  async getFromCustomer(customer: string): Promise<IReviews[]> {
    return await this.model
      .find({ customer })
      .sort({ createdAt: -1 })
      .exec()
  }

  async getFromSupplier(supplier: string): Promise<IReviews[]> {
    return await this.model
      .find({ supplier })
      .sort({ createdAt: -1 })
      .exec()
  }

  async getFromDriver(driver: string): Promise<IReviews[]> {
    return await this.model
      .find({ driver })
      .sort({ createdAt: -1 })
      .exec()
  }

  async getFromOrder(order: string): Promise<IReviews[]> {
    return await this.model
      .find({ order })
      .sort({ createdAt: -1 })
      .exec()
  }
}
