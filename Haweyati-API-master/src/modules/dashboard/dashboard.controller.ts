import { Controller, Get } from "@nestjs/common"
import { DashboardService } from './dashboard.service'

@Controller('dashboard')
export class DashboardController {
  constructor(protected readonly service: DashboardService) {}

  @Get()
  async get(): Promise<any>{
    return await this.service.allData();
  }
}
