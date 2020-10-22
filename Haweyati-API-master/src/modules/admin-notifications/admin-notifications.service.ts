import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AppGateway } from '../../app.gateway'
import { SimpleService } from '../../common/lib/simple.service'
import { IAdminNotification } from '../../data/interfaces/adminNotification.interface'

@Injectable()
export class AdminNotificationsService extends SimpleService<IAdminNotification> {
  static staticModel

  constructor(
    @InjectModel('admin-notifications')
    protected readonly model: Model<IAdminNotification>,
    private readonly appGateway: AppGateway
  ) {
    super(model)
    AdminNotificationsService.staticModel = model
  }

  async fetch(id?: string): Promise<IAdminNotification[] | IAdminNotification> {
    if (id) return await this.model.findById(id).exec()
    else
      return await this.model
        .find()
        .sort({ createdAt: -1 })
        .limit(10)
        .exec()
  }

  async create(document: any): Promise<IAdminNotification> {
    const note = await super.create(document)
    if (note) {
      if (AppGateway.socket) {
        this.appGateway.handleMessage(AppGateway.socket, note)
      }
    }
    return note
  }

  async change(): Promise<any> {
    return await this.model.updateMany({ seen: false }, { seen: true }).exec()
  }

  static async findSeen(): Promise<Boolean> {
    return !!(await this.staticModel.findOne({ seen: false }).exec())
  }
}
