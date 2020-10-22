import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { RewardPointsService } from './reward-points.service';
import { RewardPointsController } from './reward-points.controller';
import { BuildingMaterialsModule } from '../building-materials/building-materials.module'
import { FinishingMaterialsModule } from '../finishing-materials/finishing-materials.module'
import { BuildingMaterialRewardPointsSchema } from '../../data/schemas/buildingMaterialRewardPoints.schema'
import { FinishingMaterialRewardPointsSchema } from '../../data/schemas/finishingMaterialRewardPoints.schema'

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {name: 'buildingmaterialrewardpoints', schema: BuildingMaterialRewardPointsSchema},
        {name: 'finishingmaterialrewardpoints', schema: FinishingMaterialRewardPointsSchema}
      ]
    ),
    BuildingMaterialsModule,
    FinishingMaterialsModule
  ],
  providers: [RewardPointsService],
  controllers: [RewardPointsController]
})
export class RewardPointsModule {}
