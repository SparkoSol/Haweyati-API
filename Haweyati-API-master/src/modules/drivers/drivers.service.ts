import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { SimpleService } from '../../common/lib/simple.service'
import { IDriversInterface } from '../../data/interfaces/drivers.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IDriverRequest } from '../../data/interfaces/driverRequest.interface'
import { IRejectedDrivers } from '../../data/interfaces/rejectedDrivers.interface'
import { PersonsService } from '../persons/persons.service'
import { AdminNotificationsService } from '../admin-notifications/admin-notifications.service'

@Injectable()
export class DriversService extends SimpleService<IDriversInterface> {
  constructor(
    @InjectModel('drivers')
    protected readonly model: Model<IDriversInterface>,
    @InjectModel('driverRequest')
    protected readonly requestModel: Model<IDriverRequest>,
    @InjectModel('driverRejection')
    protected readonly rejectedModel: Model<IRejectedDrivers>,

    protected readonly personsService: PersonsService,
    protected readonly adminNotificationsService: AdminNotificationsService
  )
  {
    super(model)
  }

  async fetch(id?: string): Promise<IDriversInterface[] | IDriversInterface> {
    if (id) {
      const data = await this.model
        .findOne({ _id: id, supplier: null })
        .populate('profile')
        .exec()
      // @ts-ignore
      data.profile.password = ''
      return data
    } else {
      const all = await this.model
        .find({ supplier: null })
        .populate('profile')
        .exec()
      for (let data of all) {
        // @ts-ignore
        data.profile.password = ''
      }
      return all
    }
  }

  async create(document: any): Promise<IDriversInterface> {
    let driver = undefined;
    const person = await this.personsService.create(document)

    if (person){
        document.profile = person

        document.location = {
          latitude: document.latitude,
          longitude: document.longitude,
          address: document.address
        }
        document.vehicle = {
          name: document.vehicleName,
          model: document.model,
          identificationNo: document.identificationNo,
          type: document.type
        }

        driver = await super.create(document)
        if (driver){
          await this.requestModel.create({
            driver: driver._id,
            status: driver.status
          })
        }
      }
    else{
      throw new HttpException(
        'Driver unable to SignUp, Please contact Admin Support',
        HttpStatus.NOT_ACCEPTABLE
      )
    }

    //notification for admin
    if (driver){
      if (typeof(person) != 'string'){
        await this.personsService.change(person)
      }
      const notification = {
        type: 'Driver',
        title: 'New Driver',
        // @ts-ignore
        message: 'New Driver SignUp with name : ' + (await this.model.findOne({profile: driver.profile}).populate('profile').exec()).profile.name +'.'
      }
      this.adminNotificationsService.create(notification);
    }
    else {
      if (typeof(person) == 'string'){
        await this.personsService.delete(person)
      }
    }

    return driver
  }

  async getRequests(): Promise<IDriverRequest[]> {
    // eslint-disable-next-line prefer-const
    let requests = await this.requestModel.find({ status: 'Pending' }).exec()

    for (let i = 0; i < requests.length; i++) {
      requests[i].driver = (await this.fetch(
        requests[i].driver.toString()
      )) as IDriversInterface
    }

    return requests
  }

  async getByStatus(status: string): Promise<IDriversInterface[]>{
    return await this.model
      .find({ status, supplier: null })
      .populate('profile')
      .exec()
  }

  async updateByStatus(id: string, status: string): Promise<any>{
    const request = await this.requestModel.findById(id).exec()
    await this.model
      .findByIdAndUpdate(request.driver._id, { status })
      .exec()
    await this.requestModel.findByIdAndDelete(id)
    return {
      message: 'Request Approved'
    }
  }

  async getRejected(id: string, data?: any): Promise<any> {
    const request = await this.requestModel.findById(id).exec()
    if (data != null) {
      await this.rejectedModel.create({
        request: id,
        message: data.message,
        createdAt: Date.now()
      })
    }
    await this.model
      .findByIdAndUpdate(request.driver._id, { status: 'Rejected' })
      .exec()
    await this.requestModel.findByIdAndUpdate(id, { status: 'Rejected' })
    return {
      message: 'Request Rejected'
    }
  }

  async getCompanyDrivers(id: string): Promise<IDriversInterface[]> {
    return await this.model
      .find()
      .where('supplier', id)
      .populate('profile')
      .exec()
  }

  async getByPersonId(id: string) {
    return await this.model
      .findOne({ profile: id })
      .populate('profile')
      .exec()
  }
}