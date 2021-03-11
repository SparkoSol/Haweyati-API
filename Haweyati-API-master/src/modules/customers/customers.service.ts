import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { PersonsService } from '../persons/persons.service'
import { SimpleService } from '../../common/lib/simple.service'
import { LocationUtils } from '../../common/lib/location-utils'
import { IPerson } from '../../data/interfaces/person.interface'
import { NoGeneratorUtils } from '../../common/lib/no-generator-utils'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ICustomer } from '../../data/interfaces/customer.interface'
import { AdminNotificationsService } from '../admin-notifications/admin-notifications.service'
import { FcmService } from '../fcm/fcm.service'
import { IAdminNotification } from "../../data/interfaces/adminNotification.interface";

@Injectable()
export class CustomersService extends SimpleService<ICustomer> {
  constructor(
    @InjectModel('customers')
    protected readonly model: Model<ICustomer>,
    protected readonly fcmService: FcmService,
    protected readonly personService: PersonsService,
    protected readonly adminNotificationsService: AdminNotificationsService
  ) {
    super(model)
  }

  async searchActive(query: any): Promise<ICustomer[]>{
    const results = []

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

  async searchGuest(query: any): Promise<ICustomer[]>{
    const results = []

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

  async searchBlocked(query: any): Promise<ICustomer[]>{
    const persons = await this.personService.search(query)
    const activeCustomers = await this.getWithScopeCustomer('Blocked')
    const results = []

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

  async fetch(id?: string): Promise<ICustomer | ICustomer[]> {
    if (id) {
      return (await this.model
        .findById(id)
        .where('status', 'Active')
        .populate('profile')
        .exec()) as ICustomer
    } else {
      return (await this.model
        .find()
        .where('status', 'Active')
        .populate('profile')
        .exec()) as ICustomer[]
    }
  }

  async createAdmin(document: any): Promise<ICustomer>{
    document.scope = 'customer'

    if (document.profile) {
      document.profile = await this.personService.addScope(
        document.profile._id,
        document.scope
      )
    } else {
      document.email = document.email == '' ? undefined : document.email
      document.username = document.contact
      document.profile = await this.personService.create(document)
    }
    document.location = {
      longitude: document.longitude,
      latitude: document.latitude,
      address: document.address ?? await LocationUtils.getAddress(document.latitude, document.longitude)
    }

    const customer: any = await super.create(document)
    await this.sendAdminNotification(customer.profile)

    return await this.model
      .findById(customer._id)
      .populate('profile')
      .exec()
  }

  async create(document: any): Promise<ICustomer> {
    let customer: any
    document.scope = 'customer'

    document.profile = await this.personService.addScope(
      document.profile._id,
      document.scope
    )

    if (document.profile) {
      //Generating referral code
      document.referralCode = 'HW-Refer-' + await NoGeneratorUtils.generateCode()
      if (document.referralCode){
        if (await this.model.findOne({referralCode: document.fromReferralCode}).exec()){
          document.points = 500
        }
        else {
          throw new HttpException(
            'Referral code not exist. Try to SignUp without referral code.',
            HttpStatus.NOT_ACCEPTABLE
          )
        }
      }
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

  async new(document: any): Promise<ICustomer> {
    document.profile.scope = 'customer'

    document.profile.username = document.profile.contact
    if (document.profile.email == '')
      delete document.profile.email

    if (document.referralCode){
        document.fromReferralCode = document.referralCode
    }

    //Generating referral code
    document.referralCode = 'HW-Refer-' + await NoGeneratorUtils.generateCode()
    if (document.referralCode){
      if (await this.model.findOne({referralCode: document.fromReferralCode}).exec()){
        document.points = 500
      }
      else {
        throw new HttpException(
          'Referral code not exist. Try to SignUp without referral code.',
          HttpStatus.NOT_ACCEPTABLE
        )
      }
    }
    return await this.createCustomer(document)
  }

  async getGuest(): Promise<ICustomer[]>{
    const result = new Set()
    const persons = (await this.personService.fetch()) as IPerson[]
    for (const person of persons){
      if (person.scope.includes('guest')){
        result.add(await this.model.findOne({profile : person._id}).populate('profile').exec())
      }
    }
    return Array.from(result) as ICustomer[]
  }

  async guestNew(document: any): Promise<ICustomer> {
    document.profile.scope = 'guest'
    document.profile.name = 'HW-Guest-' + await NoGeneratorUtils.generateCode()

    document.profile.username = document.profile.contact

    if (!document.profile._id)
      document.profile._id = undefined

    return await this.createCustomer(document)
  }

  private async createCustomer(document: any): Promise<ICustomer>{
    let customer: any
    const person = await this.personService.create(document.profile)

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

  async convertFromGuest(document: any): Promise<ICustomer>{
    const profile = await this.personService.scopeConversion(document.profile)
    //Generating referral code
    const referralCode = 'HW-Refer-' + await NoGeneratorUtils.generateCode()
    const customer = await this.model.findOne({profile: document.profile}).exec()
    if (customer){
      await this.model.findByIdAndUpdate(customer._id, {referralCode}).exec()
      return await this.model.findOneAndUpdate({ profile }, {location: document.location}).populate('profile').exec()
    }
  }

  protected async sendAdminNotification(profile: any): Promise<IAdminNotification>{
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

    const person = await this.personService.change(document)

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

  async getWithScopeCustomer(status: string): Promise<ICustomer[]>{
    let activeOnes: ICustomer[];
    if (status == 'Blocked')
      activeOnes = (await this.model.find({status: 'Blocked'}).populate('profile').exec()) as ICustomer[]
    else
      activeOnes = (await this.fetch()) as ICustomer[]

    const result = new Set()
    for (const activeOne of activeOnes) {
      // @ts-ignore
      if (activeOne.profile.scope.includes('customer'))
        result.add(activeOne)
    }
    return (Array.from(result)) as ICustomer[]

  }

  async getUnblocked(id: string): Promise<ICustomer> {
    return await this.model.findByIdAndUpdate(id, { status: 'Active' }).exec()
  }

  async guestSignUp(document: any): Promise<ICustomer> {
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

  async getBlocked(id?: string, msg?: string): Promise<ICustomer | ICustomer[]> {
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

  async getProfile(contact: string): Promise<ICustomer> {
    const person = await this.personService.fetchFromContact(contact)
    if (person?.scope.includes('customer') || person?.scope.includes('guest')) {
      return await this.model
        .findOne({ profile: person._id })
        .populate('profile')
        .exec()
    } else
      throw new HttpException('No Customer Found', HttpStatus.NOT_ACCEPTABLE)
  }

  async getAll(
    id?: string
  ): Promise<ICustomer[] | ICustomer> {
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

  async updatePointsFromReferral(referralCode: string, points: number, add: boolean): Promise<ICustomer>{
    let customer = await this.model.findOne({referralCode})
    if (customer.points)
      add ? customer.points += points : customer.points -= points
    else
      add ? customer.points = points : customer.points = 0
    customer = await customer.save()
    
    this.sendNotificationToCustomer(
      customer.profile.toString(),
      'Congratulations! You got 500 reward points.',
      'The customer signed up from your referral purchases a product for the first time.'
    )
    return customer
  }
  
  async updatePointsFromId(id: string, points: number, add: boolean): Promise<ICustomer>{
    const customer = await this.model.findById({_id: id})
    if (customer.points)
      add ? customer.points += points : customer.points -= points
    else
      add ? customer.points = points : customer.points = 0
    return  await customer.save()
  }
  
  async sendNotificationToCustomer(profile: string, title: string, message: string): Promise<void>{
    await this.fcmService.sendSingle({
      id: profile,
      title: title,
      body: message
    })
  }
}
