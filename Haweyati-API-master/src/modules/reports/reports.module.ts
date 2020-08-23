import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { OrdersModule } from '../orders/orders.module'

@Module({
  imports: [OrdersModule],
  providers: [ReportsService],
  controllers: [ReportsController]
})
export class ReportsModule {}
