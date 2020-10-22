import {
  Get,
  Body,
  Post,
  Patch,
  Controller
} from '@nestjs/common'
import { RewardPointsService } from './reward-points.service'

@Controller('reward-points')
export class RewardPointsController {
  constructor(protected readonly service: RewardPointsService) {}

  @Get('get-fm')
  async getRewardPointsFinishingMaterial(): Promise<any>{
    return await this.service.getRewardPointsFinishingMaterial()
  }

  @Get('get-bm')
  async getRewardPointsBuildingMaterial(): Promise<any>{
    return await this.service.getRewardPointsBuildingMaterial()
  }

  @Get('finishing-material')
  async getFinishingMaterial(): Promise<any>{
    return await this.service.getFinishingMaterial()
  }

  @Get('building-material')
  async getBuildingMaterial(): Promise<any>{
    return await this.service.getBuildingMaterial()
  }

  @Post()
  async post(@Body() data: any): Promise<any> {
    return await this.service.create(data)
  }

  @Patch()
  async patch(@Body() document: any): Promise<any> {
    return await this.service.update(document)
  }
}
