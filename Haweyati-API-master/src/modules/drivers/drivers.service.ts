import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { SimpleService } from '../../common/lib/simple.service'
import { IDriversInterface } from '../../data/interfaces/drivers.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IDriverRequest } from '../../data/interfaces/driverRequest.interface'
import { PersonsService } from '../persons/persons.service'
import { AdminNotificationsService } from '../admin-notifications/admin-notifications.service'

@Injectable()
export class DriversService extends SimpleService<IDriversInterface> {
  constructor(
    @InjectModel('drivers')
    protected readonly model: Model<IDriversInterface>,
    @InjectModel('driverRequest')
    protected readonly requestModel: Model<IDriverRequest>,

    protected readonly personsService: PersonsService,
    protected readonly adminNotificationsService: AdminNotificationsService
  ) {
    super(model)
  }

  async fetch(id?: string): Promise<IDriversInterface[] | IDriversInterface> {
    if (id) {
      return await this.model
        .findById(id)
        .populate('profile')
        .exec()
    } else {
      return await this.model
        .find()
        .populate('profile')
        .exec()
    }
  }

  async create(document: any): Promise<IDriversInterface> {
    const allDrivers = await this.model.find().exec()
    for (let driver of allDrivers){
      if (document.identificationNo == driver.vehicle.identificationNo){
        throw new HttpException(
          'Vehicle with this Identification No already exists!',
          HttpStatus.NOT_ACCEPTABLE
        )
      }
      if (document.license == driver.license){
        throw new HttpException(
          'Driver with this license already exists!',
          HttpStatus.NOT_ACCEPTABLE
        )
      }
    }

    let driver = undefined
    document._id = undefined
    document.scope = 'driver'

    const personObject = {
      scope: document.scope,
      contact: document.contact,
      email: document.email,
      password: document.password,
      image: document.image,
      name: document.name,
      username: document.username
    }

    const person = await this.personsService.create(personObject)
    if (person) {
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
      const driverRequest = {
        driver: driver._id.toString(),
        status: driver.status.toString(),
        message: ''
      }
      if (driver) {
        await this.requestModel.create(driverRequest)
      }
    } else {
      throw new HttpException(
        'Driver unable to SignUp, Please contact Admin Support',
        HttpStatus.NOT_ACCEPTABLE
      )
    }

    //notification for admin
    if (driver) {
      if (typeof person != 'string') {
        await this.personsService.change(person)
      }
      const notification = {
        type: 'Driver',
        title: 'New Driver',
        message:
          'New Driver SignUp with name : ' +
          (
            await this.model
              .findOne({ profile: driver.profile })
              .populate('profile')
              .exec()
            // @ts-ignore
          ).profile.name + '.'
      }
      await this.adminNotificationsService.create(notification)
    } else {
      if (typeof person == 'string') {
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

  async getByStatus(status: string): Promise<IDriversInterface[]> {
    return await this.model
      .find({ status })
      .populate('profile')
      .exec()
  }

  async updateByStatus(id: string, status: string): Promise<any> {
    const request = await this.requestModel.findById(id).exec()
    await this.model.findByIdAndUpdate(request.driver._id, { status }).exec()
    await this.requestModel.findByIdAndDelete(id)
    return {
      message: 'Request Approved'
    }
  }

  async getRejected(id: string, data?: any): Promise<any> {
    const request = await this.requestModel.findById(id).exec()
    await this.model
      .findByIdAndUpdate(request.driver._id, { status: 'Rejected' })
      .exec()

    if (data){
      await this.requestModel.findByIdAndUpdate(id, { status: 'Rejected', message: data.message })
    }else {
      await this.requestModel.findByIdAndUpdate(id, { status: 'Rejected' })
    }

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