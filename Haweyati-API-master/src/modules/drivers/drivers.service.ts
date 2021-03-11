import { AdminNotificationsService } from '../admin-notifications/admin-notifications.service'
import { IDriverRequest } from '../../data/interfaces/driverRequest.interface'
import { IDriver } from '../../data/interfaces/drivers.interface'
import { IVehicleType } from "../../data/interfaces/vehicleType.interface"
import { VehicleTypeService } from "../vehicle-type/vehicle-type.service"
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
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
      const data = await this.model
        .findOne({ _id: id })
        .populate('profile')
        .exec();

      return await this.populateVehicleType(data)
    } else {
      const all = await this.model
        .find()
        .populate('profile')
        .exec()

      return await this.populateVehicleType(all)
    }
  }

  async create(document: any): Promise<IDriver> {
    const allDrivers = await this.model.find().exec()
    for (const driver of allDrivers) {
      if (document.identificationNo == driver.vehicle.identificationNo) {
        if (document._id != driver._id)
          throw new HttpException(
            'Vehicle with this Identification No already exists!',
            HttpStatus.NOT_ACCEPTABLE
          )
      }
      if (document.license == driver.license) {
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

    return await this.populateVehicleType(driver) as IDriver
  }

  async change(document: any): Promise<IDriver> {
    const allDrivers = await this.model
      .find({ status: { $nin: ['Rejected'] } })
      .exec()

    for (const driver of allDrivers) {
      if (document.identificationNo == driver.vehicle.identificationNo) {
        if (document._id != driver._id)
          throw new HttpException(
            'Vehicle with this Identification No already exists!',
            HttpStatus.NOT_ACCEPTABLE
          )
      }
      else if (document.license == driver.license) {
        if (document._id != driver._id)
          throw new HttpException(
            'Driver with this license already exists!',
            HttpStatus.NOT_ACCEPTABLE
          )
      }
    }

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
    let driver = await this.model.findByIdAndUpdate(document._id, document).exec() as IDriver

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

    driver = await this.model.findById(driver._id).populate('profile').exec()
    return await this.populateVehicleType(driver) as IDriver
  }

  async updateLocation(document: any): Promise<IDriver>{
    return await this.model.findByIdAndUpdate(document._id, {liveLocation: document.liveLocation, lastUpdatedLocation: document.lastUpdatedLocation}).exec()
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
    return await this.model.find({city}).populate('profile').exec()
  }

  async getCompanyDrivers(id: string): Promise<IDriver[]> {
    const all =  await this.model
      .find()
      .where('supplier', id)
      .populate('profile')
      .exec()

    return (await this.populateVehicleType(all)) as IDriver[]
  }

  async getByPersonId(id: string): Promise<IDriver>{
    const data = await this.model
      .findOne({ profile: id })
      .populate('profile')
      .exec();
    return (await this.populateVehicleType(data)) as IDriver
  }

  async populateVehicleType(all: IDriver | IDriver[]): Promise<IDriver | IDriver[]>{
    if (Array.isArray(all)){
      for (const data of all) {
        (data.profile as IPerson).password = ''
        data.vehicle.type = (await this.vehicleTypeService.fetch(data.vehicle.type.toString())) as IVehicleType
      }
      return all as IDriver[]
    }
    else {
      (all.profile as IPerson).password = ''
      all.vehicle.type = (await this.vehicleTypeService.fetch(all.vehicle.type.toString())) as IVehicleType
      return all as IDriver
    }
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
