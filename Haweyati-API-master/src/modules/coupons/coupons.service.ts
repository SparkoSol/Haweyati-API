import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ICoupons } from "../../data/interfaces/coupons.interface";
import { SimpleService } from "../../common/lib/simple.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as moment from 'moment'

@Injectable()
export class CouponsService extends SimpleService<ICoupons> {
  constructor(
    @InjectModel('coupons') protected readonly model: Model<ICoupons>
  ) {
    super(model)
  }

  async create(document: ICoupons): Promise<ICoupons> {
    if (await this.model.findOne({ code: document.code }).exec())
      throw new HttpException(
        'Coupon Code Already Exists!',
        HttpStatus.NOT_ACCEPTABLE
      )
    return super.create(document)
  }

  async checkCouponValidity(code: string, userId: string): Promise<ICoupons> {
    const coupon = await this.model.findOne({ code }).exec()
    if (coupon){
      if (coupon.isOneTime)
        if (!coupon.usedBy.includes(userId))
          if (moment() <= moment(coupon.expiry))
            return coupon
          else throw new HttpException('Coupon expired!', HttpStatus.NOT_ACCEPTABLE)
        else throw new HttpException('Coupon already used!', HttpStatus.NOT_ACCEPTABLE)
      else return coupon
    }
    else throw new HttpException(
      'Invalid Coupon!',
      HttpStatus.NOT_ACCEPTABLE
    )
  }

  async addUser(code: string, userId: string): Promise<ICoupons> {
    const coupon = await this.model.findOne({ code }).exec()
    if (coupon.isOneTime) {
      if (!coupon.usedBy.includes(userId)) {
        coupon.usedBy.push(userId)
        return await coupon.save()
      } else
        throw new HttpException(
          'Coupon Already Used or Expired!',
          HttpStatus.NOT_ACCEPTABLE
        )
    } else {
      coupon.usedBy.push(userId)
      return await coupon.save()
    }
  }
}
