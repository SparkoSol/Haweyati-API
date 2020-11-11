import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { PersonsService } from '../persons/persons.service'
import { SimpleService } from '../../common/lib/simple.service'
import { LocationUtils } from '../../common/lib/location-utils'
import { IPerson } from '../../data/interfaces/person.interface'
import { NoGeneratorUtils } from '../../common/lib/no-generator-utils'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ICustomerInterface } from '../../data/interfaces/customers.interface'
import { AdminNotificationsService } from '../admin-notifications/admin-notifications.service'

@Injectable()
export class CustomersService extends SimpleService<ICustomerInterface> {
  constructor(
    @InjectModel('customers')
    protected readonly model: Model<ICustomerInterface>,
    protected readonly personService: PersonsService,
    protected readonly adminNotificationsService: AdminNotificationsService
  ) {
    super(model)
  }

  async searchActive(query: any) {
    let results = []

    const persons = await this.personService.search(query)
    const activeCustomers = await this.getWithScopeCustomer('Active')
    if (activeCustomers) {
      for (const item of persons) {
        item.password = ''
        for (const index of activeCustomers) {
          // @ts-ignore
          if (item._id == index.profile.id) {
            results.push(index)
          }
        }
      }
    }
    return results
  }

  async searchGuest(query: any) {
    let results = []

    const persons = await this.personService.search(query)
    const activeCustomers = await this.getGuest()
    if (activeCustomers) {
      for (const item of persons) {
        item.password = ''
        for (const index of activeCustomers) {
          // @ts-ignore
          if (item._id == index.profile.id) {
            results.push(index)
          }
        }
      }
    }
    return results
  }

  async searchBlocked(query: any) {
    const persons = await this.personService.search(query)
    const activeCustomers = await this.getWithScopeCustomer('Blocked')
    let results = []

    if (activeCustomers) {
      for (const item of persons) {
        item.password = ''
        for (const index of activeCustomers) {
          // @ts-ignore
          if (item._id == index.profile.id) {
            results.push(index)
          }
        }
      }
    }
    return results
  }

  async fetch(id?: string): Promise<any> {
    if (id) {
      return (await this.model
        .findById(id)
        .where('status', 'Active')
        .populate('profile')
        .exec()) as ICustomerInterface
    } else {
      return (await this.model
        .find()
        .where('status', 'Active')
        .populate('profile')
        .exec()) as ICustomerInterface[]
    }
  }

  async create(document: any): Promise<any> {
    let customer: any
    document.scope = 'customer'

    document.profile = await this.personService.addScope(
      document.profile._id,
      document.scope
    )

    if (document.profile) {
      customer = await super.create(document)
    } else
      throw new HttpException(
        'Unable to sign up! Try again later',
        HttpStatus.NOT_ACCEPTABLE
      )

    await this.sendAdminNotification(customer.profile)

    return await this.model
      .findById(customer._id)
      .populate('profile')
      .exec()
  }

  async new(document: any): Promise<any> {
    let person: any
    let customer: any
    document.profile.scope = 'customer'

    document.profile.username = document.profile.contact
    if (document.profile.email == '')
      delete document.profile.email

    return await this.createCustomer(document.profile)
  }

  async getGuest(): Promise<any>{
    let result = new Set()
    const persons = (await this.personService.fetch()) as IPerson[]
    for (let person of persons){
      if (person.scope.includes('guest')){
        result.add(await this.model.findOne({profile : person._id}).populate('profile').exec())
      }
    }
    return Array.from(result)
  }

  async guestNew(document: any): Promise<any> {
    document.profile.scope = 'guest'
    document.profile.name = 'HW-Guest-' + await NoGeneratorUtils.generateCode()

    document.profile.username = document.profile.contact

    return await this.createCustomer(document)
  }

  private async createCustomer(document: any): Promise<any>{
    let customer: any
    let person: any
    person = await this.personService.create(document.profile)

    if (person) {
      document.profile = person
      customer = await super.create(document)
    } else
      throw new HttpException(
        'Unable to sign up! Try again later',
        HttpStatus.NOT_ACCEPTABLE
      )

    await this.sendAdminNotification(customer.profile);

    return await this.model
      .findById(customer._id)
      .populate('profile')
      .exec()
  }

  async convertFromGuest(document: any): Promise<ICustomerInterface>{
    const profile = await this.personService.scopeConversion(document.profile)
    return await this.model.findOneAndUpdate({ profile }, {location: document.location}).populate('profile').exec()
  }

  protected async sendAdminNotification(profile: any){
    const notification = {
      type: 'Customer',
      title: 'New Customer',
      message:
        'New Customer SignUp with name : ' +
        (
          await this.model
            .findOne({ profile })
            .populate('profile')
            .exec()
        )
          // @ts-ignore
          .profile.name +
        '.'
    }
    return this.adminNotificationsService.create(notification)
  }

  async change(document: any): Promise<any> {
    const _id = document._id
    document._id = document.personId

    let person = await this.personService.change(document)

    document.personId = document._id
    document._id = _id
    if (person) {
      try {
        document.location = {
          longitude: document.longitude,
          latitude: document.latitude,
          address: document.address
            ? document.address
            : await LocationUtils.getAddress(
                document.latitude,
                document.longitude
              )
        }
        document.profile = document.personId
        await super.change(document)
      } catch (e) {
        throw new HttpException(
          'Customer unable to Update, Please contact Admin Support',
          HttpStatus.NOT_ACCEPTABLE
        )
      }
    } else
      throw new HttpException(
        'Customer unable to Update, Please contact Admin Support',
        HttpStatus.NOT_ACCEPTABLE
      )

    return await this.fetch(document._id)
  }

  async getWithScopeCustomer(status: string): Promise<ICustomerInterface[]>{
    let activeOnes: ICustomerInterface[];
    if (status == 'Blocked')
      activeOnes = (await this.model.find({status: 'Blocked'}).populate('profile').exec()) as ICustomerInterface[]
    else
      activeOnes = (await this.fetch()) as ICustomerInterface[]

    const result = new Set()
    for (let activeOne of activeOnes) {
      // @ts-ignore
      if (activeOne.profile.scope.includes('customer'))
        result.add(activeOne)
    }
    return (Array.from(result)) as ICustomerInterface[]

  }

  async getUnblocked(id: string): Promise<any> {
    return await this.model.findByIdAndUpdate(id, { status: 'Active' }).exec()
  }

  async guestSignUp(document: any): Promise<ICustomerInterface> {
     document.name = "Guest " + document.contact
     document.username, document.password = document.contact
     document.guest = true
     document.scope = 'customer'

     document.location = {
       longitude: document.longitude,
       latitude: document.latitude,
       address: document.address
         ? document.address
         : await LocationUtils.getAddress(document.latitude, document.longitude)
     }
     document.profile = await this.personService.create(document)
     return await this.model.create(document)
  }

  async getBlocked(id?: string, msg?: string): Promise<any> {
    if (id && msg)
      return await this.model
        .findByIdAndUpdate(id, { status: 'Blocked', message: msg })
        .exec()
    else if (id && !msg)
      return await this.model
        .findByIdAndUpdate(id, { status: 'Blocked' })
        .exec()
    else {
      const data = await this.model.find({ status: 'Blocked' }).exec()
      if (data) {
        for (let i = 0; i < data.length; ++i) {
          data[i].profile = <IPerson>(
            await this.personService.fetch(data[i].profile.toString())
          )
          if (data[i].profile != null) {
            // @ts-ignore
            data[i].profile.username = ''
            // @ts-ignore
            data[i].profile.password = ''
          }
        }
      }
      return data
    }
  }

  async getProfile(contact: string): Promise<ICustomerInterface | string> {
    const person = await this.personService.fetchFromContact(contact)
    if (person?.scope.includes('customer') || person?.scope.includes('guest')) {
      const customer = await this.model
        .findOne({ profile: person._id })
        .populate('profile')
        .exec()
      // @ts-ignore
      // customer.profile.password = ''
      return customer
    } else {
      throw new HttpException('No Customer Found', HttpStatus.NOT_ACCEPTABLE)
    }
  }

  async getAll(
    id?: string
  ): Promise<ICustomerInterface[] | ICustomerInterface> {
    if (id)
      return await this.model
        .findById(id)
        .populate('profile')
        .exec()
    else
      return await this.model
        .find()
        .populate('profile')
        .exec()
  }
}
