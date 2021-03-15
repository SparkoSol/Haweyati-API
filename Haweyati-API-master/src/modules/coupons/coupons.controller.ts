import { CouponsService } from './coupons.service'
import { dtoCoupon } from '../../data/dtos/coupon.dto'
import { ICoupon } from '../../data/interfaces/coupons.interface'
import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { SimpleController } from '../../common/lib/simple.controller'

@Controller('coupons')
export class CouponsController extends SimpleController<ICoupon> {
  constructor(protected readonly service: CouponsService) {
    super(service)
  }

  @Post('check-coupon-validity')
  async checkCouponsValidity(@Body() data: dtoCoupon): Promise<ICoupon> {
    return await this.service.checkCouponValidity(data.code, data.user)
  }

  @Get('use-coupon')
  async useCoupon(@Query() data: dtoCoupon): Promise<ICoupon> {
    return await this.service.addUser(data.code, data.user)
  }
}
