import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { BuildingMaterialsService } from '../building-materials/building-materials.service'
import { FinishingMaterialsService } from '../finishing-materials/finishing-materials.service'
import { IBuildingMaterialRewardPoints } from '../../data/interfaces/buildingMaterialRewardPoints.interface'
import { IFinishingMaterialRewardPoints } from '../../data/interfaces/finishingMaterialRewardPoints.interface'

@Injectable()
export class RewardPointsService {
  constructor(
    @InjectModel('buildingmaterialrewardpoints')
    protected readonly model: Model<IBuildingMaterialRewardPoints>,
    @InjectModel('finishingmaterialrewardpoints')
    protected readonly fmModel: Model<IFinishingMaterialRewardPoints>,

    private readonly fmService: FinishingMaterialsService,
    private readonly bmService: BuildingMaterialsService
  )
  {}

  async getRewardPointsFinishingMaterial(): Promise<any>{
    return await this.fmModel.find().populate('material').exec()
  }

  async getRewardPointsBuildingMaterial(): Promise<any>{
    return await this.model.find().populate('material').exec()
  }

  async getIds(): Promise<String[]>{
    let result = []
    const data = await (((await this.fmModel.find().exec()) as []).concat((await this.model.find().exec()) as []))
    for (let document of data){
      // @ts-ignore
      result.push(document.material._id)
    }
    return result
  }

  async getBuildingMaterial(): Promise<any>{
    return await this.bmService.getDataForRewardPoints(await this.getIds())
  }

  async getFinishingMaterial(): Promise<any>{
    return await this.fmService.getDataForRewardPoints(await this.getIds())
  }

  async create(document: any): Promise<any> {
    if (document.type == 'BuildingMaterial')
      return await this.model.create(document)
    else
      return await this.fmModel.create(document)
  }

  async update(document: any): Promise<any>{
    if (document.type == 'BuildingMaterial')
      return await this.model.findByIdAndUpdate(document._id, document).exec()
    else
      return await this.fmModel.findByIdAndUpdate(document._id, document).exec()
  }
}
