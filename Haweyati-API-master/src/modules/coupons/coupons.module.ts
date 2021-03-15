import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CouponsService } from './coupons.service'
import { CouponsController } from './coupons.controller'
import { CouponsSchema } from '../../data/schemas/coupons.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'coupons', schema: CouponsSchema }])
  ],
  providers: [CouponsService],
  controllers: [CouponsController],
  exports: [CouponsService]
})
export class CouponsModule {}
