import { HttpService, Injectable } from '@nestjs/common'
import { SimpleService } from '../../common/lib/simple.service'
import { IShopRegistrationInterface } from '../../data/interfaces/shop-registration.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ReportUtils } from '../../common/lib/report-utils'
import { PersonsService } from '../persons/persons.service'
import { IPerson } from '../../data/interfaces/person.interface'
import { LocationUtils } from '../../common/lib/location-utils'
import { AdminNotificationsService } from '../admin-notifications/admin-notifications.service'

@Injectable()
export class ShopRegistrationService extends SimpleService<IShopRegistrationInterface> {
  constructor(
    @InjectModel('shopregistration')
    protected readonly model: Model<IShopRegistrationInterface>,
    protected readonly personService: PersonsService,
    private httpService: HttpService,
    protected readonly adminNotificationsService: AdminNotificationsService
  ) {
    super(model)
  }

  async fetch(
    id?: string
  ): Promise<IShopRegistrationInterface[] | IShopRegistrationInterface> {
    if (id)
      return await this.model
        .findById(id)
        .populate('person')
        .exec()
    else {
      return await this.model
        .find({ parent: null })
        .populate('person')
        .exec()
    }
  }

  async fetchFromContact(contact: string): Promise<IPerson> {
    return await this.personService.fetchFromContact(contact)
  }

  async create(document: any): Promise<IShopRegistrationInterface> {
    document.username = document.contact
    document.scope = 'Supplier'
    const person = await this.personService.create(document)
    let supplier = undefined

    if (person){
      document.person = person

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

      supplier = super.create(document)
    }

    if (supplier){
      if (typeof(person) != 'string'){
        await this.personService.change(person)
      }
      //notification for admin
      if (document.status != "Active"){
        const notification = {
          type: 'Supplier',
          title: 'New Supplier',
          message: 'New Supplier SignUp with name : ' + document.name +'.'
        }
        this.adminNotificationsService.create(notification);
      }
    }else {
      if (typeof(person) == 'string'){
        await this.personService.delete(document.profile._id)
      }
    }

    return supplier
  }

  async change(document: any): Promise<IShopRegistrationInterface> {
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

    return super.change(document)
  }

  async updateProfile(data: any) {
    return await this.personService.change(data)
  }

  async fetchAll(): Promise<any> {
    return await this.model
      .find({ status: 'Active' })
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
      .find({ parent: id, status: 'Active' })
      .populate('person')
      .exec()
  }

  async getSuppliersByStatus(status: string) {
    return this.model
      .find({ status })
      .populate('person')
      .exec()
  }

  async changeSupplierStatus(id: string, status: string): Promise<any> {
    return await this.model.findByIdAndUpdate(id, { status }).exec()
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

  async getByProfile(id: string): Promise<IShopRegistrationInterface>{
    return await this.model.findOne({person: id}).populate('person').exec()
  }

  async generateReport() {
    return ReportUtils.renderReport('SupplierReport.odt', await this.fetch())
  }
}