import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { PersonsService } from '../persons/persons.service'
import { SimpleService } from '../../common/lib/simple.service'
import { NoGeneratorUtils } from '../../common/lib/no-generator-utils'
import { IServiceRequest } from '../../data/interfaces/serviceRequest.interface'
import { IAdminNotification } from '../../data/interfaces/adminNotification.interface'
import { AdminNotificationsService } from '../admin-notifications/admin-notifications.service'

@Injectable()
export class ServiceRequestsService extends SimpleService<IServiceRequest> {
  constructor(
    @InjectModel('servicerequests')
    protected readonly model: Model<IServiceRequest>,
    protected readonly personsService: PersonsService,
    protected readonly adminNotificationsService: AdminNotificationsService
  ) {
    super(model)
  }

  async fetch(id?: string): Promise<IServiceRequest[] | IServiceRequest> {
    if (id) {
      return await this.model
        .findById(id)
        .populate({
          path: 'suppliers',
          model: 'shopregistration',
          populate: {
            path: 'person',
            model: 'persons'
          }
        })
        .exec()
    } else return this.getByStatus()
  }

  async create(document: any): Promise<IServiceRequest> {
    const { suppliers, note, type, image, description, ...data } = document

    const serviceReq = {
      suppliers,
      type,
      description,
      data,
      note,
      image,
      requestNo: 'HW-SR-' + await NoGeneratorUtils.generateCode()
    }
    const serviceRequest = await super.create(<IServiceRequest>serviceReq)

    //notification for admin
    if (serviceRequest) {
      const notification = {
        type: 'Service',
        title: 'New Service Request',
        message: 'New Service Request with Ref. # ' + serviceReq.requestNo + '.'
      }
      await this.adminNotificationsService.create(notification as IAdminNotification)
    }
    return serviceRequest
  }

  async getByStatus(status?: string): Promise<IServiceRequest[]> {
    if (status)
      return await this.model
        .find({ status })
        .populate({
          path: 'suppliers',
          model: 'shopregistration',
          populate: {
            path: 'person',
            model: 'persons'
          }
        })
        .exec()
    else
      return await this.model
        .find()
        .populate({
          path: 'suppliers',
          model: 'shopregistration',
          populate: {
            path: 'person',
            model: 'persons'
          }
        })
        .exec()
  }

  async updateByStatus(id: string, status: string): Promise<IServiceRequest> {
    return await this.model.findByIdAndUpdate(id, { status }).exec()
  }

  async getBySupplier(id: string): Promise<IServiceRequest[]> {
    return this.model.find({ suppliers: id }).exec()
  }

  async search(query: any): Promise<IServiceRequest[]> {
    return await this.model
      .find({
        $or: [
          { requestNo: { $regex: query.name, $options: 'i' } },
          { type: { $regex: query.name, $options: 'i' } }
        ],
        status: 'Pending'
      })
      .populate({
        path: 'suppliers',
        model: 'shopregistration',
        populate: {
          path: 'person',
          model: 'persons'
        }
      })
      .exec()
  }
}
