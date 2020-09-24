import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { OrdersModule } from '../orders/orders.module'
import { ReportsController } from './reports.controller';

@Module({
  imports: [OrdersModule],
  providers: [ReportsService],
  controllers: [ReportsController]
})
export class ReportsModule {}
