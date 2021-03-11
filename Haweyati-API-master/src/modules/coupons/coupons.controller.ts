import { SimpleController } from "../../common/lib/simple.controller";
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ICoupon } from "../../data/interfaces/coupons.interface";
import { CouponsService } from "./coupons.service";

@Controller('coupons')
export class CouponsController extends SimpleController<ICoupon> {
  constructor(protected readonly service: CouponsService) {
    super(service)
  }

  @Post('check-coupon-validity')
  async checkCouponsValidity(
    @Body() data: any
  ): Promise<ICoupon> {
    return await this.service.checkCouponValidity(data.code, data.user)
  }

  @Get('use-coupon')
  async useCoupon(@Query() data: any): Promise<ICoupon> {
    return await this.service.addUser(data.code, data.user)
  }
}
