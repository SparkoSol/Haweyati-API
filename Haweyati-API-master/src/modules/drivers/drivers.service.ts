import { AdminNotificationsService } from '../admin-notifications/admin-notifications.service'
import { IDriverRequest } from '../../data/interfaces/driverRequest.interface'
import { VehicleTypeService } from "../vehicle-type/vehicle-type.service"
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { IDriver } from '../../data/interfaces/drivers.interface'
import { IPerson } from '../../data/interfaces/person.interface'
import { LocationUtils } from '../../common/lib/location-utils'
import { SimpleService } from '../../common/lib/simple.service'
import { PersonsService } from '../persons/persons.service'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class DriversService extends SimpleService<IDriver> {
  constructor(
    @InjectModel('drivers')
    protected readonly model: Model<IDriver>,
    @InjectModel('driverRequest')
    protected readonly requestModel: Model<IDriverRequest>,

    protected readonly personsService: PersonsService,
    protected readonly vehicleTypeService: VehicleTypeService,
    protected readonly adminNotificationsService: AdminNotificationsService
  ) {
    super(model)
  }

  async fetch(id?: string): Promise<IDriver[] | IDriver> {
    if (id) {
      return await this.model
        .findOne({ _id: id })
        .populate('profile')
        .populate('vehicle.type')
        .exec();
    } else {
      return await this.model
        .find()
        .populate('profile')
        .populate('vehicle.type')
        .exec()
    }
  }

  async create(document: any): Promise<IDriver> {
    if (await this.model.findOne({'vehicle.identificationNo': document.identificationNo}).exec())
      throw new HttpException(
        'Vehicle with this Identification No already exists!',
        HttpStatus.NOT_ACCEPTABLE
      )
    if (await this.model.findOne({license: document.license}).exec())
      throw new HttpException(
        'Driver with this license already exists!',
        HttpStatus.NOT_ACCEPTABLE
      )

    document.location = {
      latitude: document.latitude,
      longitude: document.longitude,
      address: await LocationUtils.getAddress(document.latitude, document.longitude)
    }
    document.vehicle = {
      name: document.vehicleName,
      model: document.model,
      identificationNo: document.identificationNo,
      type: document.type
    }
    document.scope = 'driver'
    let person: any
    let driver: any

    if (document.profile) {
      await this.personsService.addScope(document.profile, document.scope)
      driver = await super.create(document)
    } else {
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
      if (person) {
        document.profile = person

        document.city = await LocationUtils.getCity(document.latitude, document.longitude)
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
    } else {
      await this.personsService.delete(person)
      throw new HttpException(
        'Unable to sign up, Please contact admin support!',
        HttpStatus.NOT_ACCEPTABLE
      )
    }

    return await this.model
      .findById(driver._id)
      .populate('vehicle.type')
      .populate('profile')
      .exec()
  }

  async change(document: any): Promise<IDriver> {
    if (await this.model.findOne({'vehicle.identificationNo': document.identificationNo, _id: {$ne: document._id}}).exec())
      throw new HttpException(
        'Vehicle with this Identification No already exists!',
        HttpStatus.NOT_ACCEPTABLE
      )
    if (await this.model.findOne({license: document.license, _id: {$ne: document._id}}).exec())
      throw new HttpException(
        'Driver with this license already exists!',
        HttpStatus.NOT_ACCEPTABLE
      )

    let personObject = undefined

    if (document.image) {
      personObject = {
        _id: document.profile,
        image: document.image,
        name: document.name,
        email: document.email
      }
    } else {
      personObject = {
        _id: document.profile,
        name: document.name,
        email: document.email
      }
    }

    document.profile = await this.personsService.change(personObject)
    const person = document.profile
    if (person) {
      if (document.latitude){
        document.city = await LocationUtils.getCity(
          document.latitude,
          document.longitude
        )
        document.location = {
          latitude: document.latitude,
          longitude: document.longitude,
          address: await LocationUtils.getAddress(
            document.latitude,
            document.longitude
          )
        }
      }
      if (
        document.isVehicleInfoChanged == true || document.isVehicleInfoChanged == 'true'
      ) {
        document.vehicle = {
          name: document.vehicleName,
          model: document.model,
          identificationNo: document.identificationNo,
          type: document.type
        }
        if (!document.isAdmin)
          document.status = 'Pending'
      }
    }
    const driver = await this.model
      .findByIdAndUpdate(document._id, document)
      .populate('vehicle.type',)
      .populate('profile')
      .exec()

    if (driver) {
      if (!(await this.requestModel.findOne({ driver: driver._id }).exec())) {
        await this.requestModel.create({
          driver: driver._id,
          status: driver.status,
          message: undefined
        })
      }

      if (!document.isAdmin){
        const notification = {
          type: 'Driver',
          title: 'Driver Updated',
          message: 'Driver Updated with name : ' + document.name + '.'
        }
        await this.adminNotificationsService.create(notification)
      }
    }

    return driver
  }

  async getByStatus(status: string): Promise<IDriver[]> {
    return await this.model
      .find({ status })
      .populate('profile')
      .exec()
  }

  async updateByStatus(id: string, status: string): Promise<IDriver> {
    const request = await this.requestModel.findById(id).exec()
    if (request && status == 'Active') {
      const driver = await this.model.findByIdAndUpdate(request.driver, { status }).exec()
      await this.requestModel.findByIdAndDelete(id)
      return driver
    }
    else
      return await this.model.findByIdAndUpdate(id, { status }).exec()
  }

  async getVerifiedStandAloneDrivers(): Promise<IDriver[]>{
    return await this.model
      .find({status: 'Active', supplier: undefined})
      .populate('profile')
      .exec()
  }

  async getRejected(id: string, data?: any): Promise<IDriver> {
    const request = await this.requestModel.findOne({ driver: id }).exec()
    const driver = await this.model
      .findByIdAndUpdate(request.driver, { status: 'Rejected' })
      .exec()
    await this.requestModel.findOneAndUpdate(
      { driver: id },
      { status: 'Rejected' }
    )
    return driver
  }

  async getDataFromCityName(city: string): Promise<IDriver[]>{
    return await this.model.find({city})
      .populate('profile')
      .exec()
  }

  async getCompanyDrivers(id: string): Promise<IDriver[]> {
    return await this.model
      .find()
      .where('supplier', id)
      .populate('vehicle.type')
      .populate('profile')
      .exec()
  }

  async getByPersonId(id: string): Promise<IDriver>{
    return await this.model
      .findOne({ profile: id })
      .populate('vehicle.type')
      .populate('profile')
      .exec();
  }

  //used while logging out in auth.service
  async removeDeviceId(id: string): Promise<IDriver> {
    return await this.model.findByIdAndUpdate(id, {deviceId: undefined}).exec()
  }

  async updateRating(id: string, rating: number): Promise<IDriver>{
    const driver = await this.model.findById(id).exec()
    if (driver.rating){
      rating += driver.rating
      rating /= 2
    }
    return await this.model.findByIdAndUpdate(id, {rating}).exec()
  }
}
