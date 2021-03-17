import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SimpleService } from '../../common/lib/simple.service'
import { IReview } from '../../data/interfaces/reviews.interface'

@Injectable()
export class ReviewsService extends SimpleService<IReview> {
  constructor(
    @InjectModel('reviews')
    protected readonly model: Model<IReview>
  ) {
    super(model)
  }

  async getReviews(data: any): Promise<IReview[]> {
    const condition = {}

    switch (data.type) {
      case 'customer':
        condition['customer'] = data.id
        break
      case 'supplier':
        condition['supplier'] = data.id
        break
      case 'driver':
        condition['driver'] = data.id
        break
      case 'order':
        condition['order'] = data.id
    }

    return await this.model
      .find(condition)
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
