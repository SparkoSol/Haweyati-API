import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { PersonsService } from '../persons/persons.service'
import { SimpleService } from '../../common/lib/simple.service'
import { IPerson } from '../../data/interfaces/person.interface'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { IDriversInterface } from '../../data/interfaces/drivers.interface'
import { IDriverRequest } from '../../data/interfaces/driverRequest.interface'
import { AdminNotificationsService } from '../admin-notifications/admin-notifications.service'
import { LocationUtils } from '../../common/lib/location-utils'

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
      let data = await (await this.model
        .findOne({ _id: id })
        .populate('profile')
        .exec());
      (data.profile as IPerson).password = ''
      return data
    } else {
      const all = await this.model
        .find()
        .populate('profile')
        .exec()

      for (const data of all) {
        ;(data.profile as IPerson).password = ''
      }
      return all
    }
  }

  async create(document: any): Promise<IDriversInterface> {
    console.log(document)
    const allDrivers = await this.model.find().exec()
    for (let driver of allDrivers){
      if (document.identificationNo == driver.vehicle.identificationNo){
        if (document._id != driver._id)
          throw new HttpException(
            'Vehicle with this Identification No already exists!',
            HttpStatus.NOT_ACCEPTABLE
          )
      }
      if (document.license == driver.license){
        if (document._id != driver._id)
          throw new HttpException(
            'Driver with this license already exists!',
            HttpStatus.NOT_ACCEPTABLE
          )
      }
    }

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
    document.scope = 'driver'
    let person: any;
    let driver: any;

    console.log(document)

    if (document.profile){
      await this.personsService.addScope(document.profile, document.scope)
      driver = await super.create(document)
    }
    else {
      const personObject = {
        scope: document.scope,
        contact: document.contact,
        email: document.email,
        password: document.password,
        image: document.image,
        name: document.name,
        username: document.contact
      }

      person = await this.personsService.create(personObject)
      if (person){
        document.profile = person

        driver = await super.create(document)
      }
    }

    if (driver) {
      await this.requestModel.create({
        driver: driver._id,
        status: driver.status,
        message: ''
      })
      const notification = {
        type: 'Driver',
        title: 'New Driver',
        message:
          'New Driver SignUp with name : ' +
          ((
            await this.model
              .findOne({ profile: driver.profile })
              .populate('profile')
              .exec()
          ).profile as IPerson).name +
          '.'
      }
      await this.adminNotificationsService.create(notification)
    }
    else {
      await this.personsService.delete(person)
      throw new HttpException(
        'Unable to sign up, Please contact admin support!',
        HttpStatus.NOT_ACCEPTABLE
      )
    }

    return driver
  }

  async change(document: any): Promise<IDriversInterface> {
    const allDrivers = await this.model.find({ status: { $nin: ['Rejected'] } }).exec()

    for (let driver of allDrivers){
      if (document.identificationNo == driver.vehicle.identificationNo){
        if (document._id != driver._id)
          throw new HttpException(
            'Vehicle with this Identification No already exists!',
            HttpStatus.NOT_ACCEPTABLE
          )
      }
      if (document.license == driver.license){
        if (document._id != driver._id)
          throw new HttpException(
            'Driver with this license already exists!',
            HttpStatus.NOT_ACCEPTABLE
          )
      }
    }

    let driver, personObject = undefined

    if (document.image){
      personObject = {
        _id: document.profile,
        image: document.profile.image,
        name: document.profile.name,
      }
    }else {
      personObject = {
        _id: document.profile,
        name: document.profile.name,
      }
    }
    const person = await this.personsService.change(personObject)

    if (person) {
      document.profile = person

      document.city = LocationUtils.getCity(document.latitude, document.longitude)
      document.location = {
        latitude: document.latitude,
        longitude: document.longitude,
        address: document.address
      }
      if (document.isVehicleInfoChanged == true || document.isVehicleInfoChanged == 'true'){
        document.vehicle = {
          name: document.vehicleName,
          model: document.model,
          identificationNo: document.identificationNo,
          type: document.type
        }
        document.status = 'Pending'
      }
    }
    driver = await super.change(document)

    if (driver) {
      if (!await this.requestModel.findOne({driver: driver._id}).exec()){
        // @ts-ignore
        await this.requestModel.create({
          driver: driver._id,
          status: driver.status
        })
      }

      const notification = {
        type: 'Driver',
        title: 'Driver Updated',
        message:
          'Driver Updated with name : ' +
          document.name + '.'
      }
      await this.adminNotificationsService.create(notification)
    }
    return driver
  }

  async getByStatus(status: string): Promise<IDriversInterface[]> {
    return await this.model
      .find({ status })
      .populate('profile')
      .exec()
  }

  async updateByStatus(id: string, status: string): Promise<any> {
    const request = await this.requestModel.findById(id).exec()
    if (request && status == 'Active'){
      await this.model.findByIdAndUpdate(request.driver._id, { status }).exec()
      await this.requestModel.findByIdAndDelete(id)
      return { message: 'Status Changed Successfully!' }
    }
    else {
      await this.model.findByIdAndUpdate(id, { status }).exec()
      return { message: 'Status Changed Successfully!' }
    }
  }

  async getRejected(id: string, data?: any): Promise<any> {
    const request = await this.requestModel.findById(id).exec()
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
