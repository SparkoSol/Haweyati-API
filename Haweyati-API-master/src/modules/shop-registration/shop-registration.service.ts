import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { PersonsService } from '../persons/persons.service'
import { SimpleService } from '../../common/lib/simple.service'
import { LocationUtils } from '../../common/lib/location-utils'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { IShopRegistration } from '../../data/interfaces/shop-registration.interface'
import { AdminNotificationsService } from '../admin-notifications/admin-notifications.service'

@Injectable()
export class ShopRegistrationService extends SimpleService<IShopRegistration> {
  constructor(
    @InjectModel('shopregistration')
    protected readonly model: Model<IShopRegistration>,
    protected readonly personService: PersonsService,
    protected readonly adminNotificationsService: AdminNotificationsService
  ) {
    super(model)
  }

  async fetch(id?: string): Promise<IShopRegistration[] | IShopRegistration> {
    if (id)
      return await this.model
        .findById(id)
        .populate('person')
        .exec()
    else {
      return await this.model
        .find()
        .populate('person')
        .exec()
    }
  }

  async create(document: any): Promise<IShopRegistration> {
    document.scope = 'supplier'
    document.location = {
      latitude: document.latitude,
      longitude: document.longitude,
      address: await LocationUtils.getAddress(
        document.latitude,
        document.longitude
      )
    }

    document.city = await LocationUtils.getCity(
      document.latitude,
      document.longitude
    )

    let supplier: any
    let person: any

    if (document.person) {
      await this.personService.addScope(document.person, document.scope)
      supplier = await this.model.create(document)
    } else {
      const personObject = {
        scope: document.scope,
        contact: document.contact,
        email: document.email == '' ? undefined : document.email,
        password: document.password,
        image: document.image,
        name: document.name,
        username: document.contact
      }

      person = await this.personService.create(personObject)
      if (person) {
        document.person = person
        supplier = await this.model.create(document)
      }
    }

    if (supplier) {
      const notification = {
        type: 'Supplier',
        title: 'New Supplier',
        message: 'New Supplier SignUp with name : ' + document.name + '.'
      }
      await this.adminNotificationsService.create(notification)
    } else {
      await this.personService.delete(person)
      throw new HttpException(
        'Unable to sign up, Please contact admin support!',
        HttpStatus.NOT_ACCEPTABLE
      )
    }

    return supplier
  }

  async change(document: any): Promise<IShopRegistration> {
    let personUpdate;
    if (document.image)
      personUpdate = {
        _id : document.personId,
        image: document.image,
        name : document.name,
        email : document.email
      }
    else
      personUpdate = {
        _id : document.personId,
        name : document.name,
        email : document.email
      }

    document.person = await this.personService.change(personUpdate)

    document.location = {
      latitude: document.latitude,
      longitude: document.longitude,
      address: await LocationUtils.getAddress(
        document.latitude,
        document.longitude
      )
    }
    document.city = await LocationUtils.getCity(
      document.latitude,
      document.longitude
    )
    return await super.change(document)
  }

  async fetchAll(): Promise<any> {
    return await this.model
      .find({ status: 'Active', parent: null })
      .populate('person')
      .exec()
  }

  async getDataFromCityName(city: string, service: string): Promise<any> {
    const data = await this.model
      .find({
        city: city,
        status: 'Active'
      })
      .exec()
    const newSet = new Set()
    data.forEach(value => {
      if (value.services.includes(service)) {
        newSet.add(value._id)
      }
    })
    return Array.from(newSet)
  }

  async getByService(name: string): Promise<any> {
    const data = await this.model
      .find({ status: 'Active' })
      .populate('person')
      .exec()
    const newSet = new Set()
    data.forEach(value => {
      if (value.services.includes(name)) {
        newSet.add(value)
      }
    })
    return Array.from(newSet)
  }

  async getSubSuppliers(id: string): Promise<any> {
    return this.model
      .find({ parent: id })
      .populate('person')
      .exec()
  }

  async getSuppliersByStatus(status: string) {
    return this.model
      .find({ status })
      .populate('person')
      .exec()
  }

  async getBlockedSuppliersWithoutParent() {
    return this.model
      .find({ status: 'Blocked', parent: null })
      .populate('person')
      .exec()
  }

  async changeSupplierStatus(
    id: string,
    status: string,
    message?: string
  ): Promise<any> {
    if (message)
      return await this.model.findByIdAndUpdate(id, { status, message }).exec()
    else {
      await this.model.findByIdAndUpdate(id, { status }).exec()
      if (status == 'Blocked') {
        const subSuppliers = await this.getSubSuppliers(id)
        for (let child of subSuppliers) {
          await this.model
            .findByIdAndUpdate(child._id, { status })
            .where('status', 'Active')
            .exec()
        }
      } else if (status == 'Active') {
        const subSuppliers = await this.model
          .find({ parent: id, status: 'Blocked' })
          .exec()
        for (let child of subSuppliers) {
          await this.model.findByIdAndUpdate(child._id, { status }).exec()
        }
      }
    }
    return 'Supplier and its child are Blocked'
  }

  async getAvailableServices(city: string): Promise<any> {
    const data = await this.model
      .find()
      .where('city', city)
      .where('status', 'Active')
      .exec()

    const newSet = new Set<string>()

    for (const item of data) {
      for (const service of item.services) {
        newSet.add(service)
      }
    }

    return Array.from(newSet)
  }

  async getByProfile(id: string): Promise<IShopRegistration> {
    return await this.model
      .findOne({ person: id })
      .populate('person')
      .exec()
  }

  async getSupplierCities(): Promise<any> {
    const suppliers = await this.model.find().exec()
    let result = new Set()
    for (let item of suppliers) {
      result.add(item.city)
    }
    return Array.from(result)
  }

  async totalSuppliers(): Promise<number> {
    return await this.model
      .find({ status: 'Active' })
      .countDocuments()
      .exec()
  }

  async suppliersCities(): Promise<string[]> {
    const suppliers = await this.model.find().exec()
    const cities: string[] = []
    for (const supplier of suppliers) {
      cities.push(supplier.city)
    }
    return cities
  }
}
