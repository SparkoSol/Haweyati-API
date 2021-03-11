import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { PersonsService } from '../persons/persons.service'
import { SimpleService } from '../../common/lib/simple.service'
import { NoGeneratorUtils } from '../../common/lib/no-generator-utils'
import { IServiceRequest } from "../../data/interfaces/serviceRequest.interface"
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
      const data = await this.model
        .findById(id)
        .populate('suppliers')
        .exec()
      // @ts-ignore
      data.suppliers.person = await this.personsService.fetch(
        // @ts-ignore
        data.suppliers.person
      )
      return data
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
      await this.adminNotificationsService.create(notification)
    }
    return serviceRequest
  }

  async getByStatus(status?: string): Promise<IServiceRequest[]> {
    let all
    if (status)
      all = await this.model
        .find({ status })
        .populate('suppliers')
        .exec()
    else
      all = await this.model
        .find()
        .populate('suppliers')
        .exec()

    for (let data of all) {
      // @ts-ignore
      data.suppliers.person = await this.personsService.fetch(
        data.suppliers.person
      )
    }
    return all
  }

  async updateByStatus(id: string, status: string): Promise<IServiceRequest> {
    return await this.model.findByIdAndUpdate(id, { status }).exec()
  }

  async getBySupplier(id: string): Promise<IServiceRequest[]> {
    return this.model.find({ suppliers: id }).exec()
  }

  async search(query: any): Promise<IServiceRequest[]>  {
    const data = await this.model
      .find({
        $or: [
          { requestNo: { $regex: query.name, $options: 'i' } },
          { type: { $regex: query.name, $options: 'i' } }
        ],
        status: 'Pending'
      })
      .populate('suppliers')
      .exec()
    for (const item of data) {
      // @ts-ignore
      item.suppliers.person = await this.personsService.fetch(
        // @ts-ignore
        item.suppliers.person
      )
    }
    return data
  }
}
