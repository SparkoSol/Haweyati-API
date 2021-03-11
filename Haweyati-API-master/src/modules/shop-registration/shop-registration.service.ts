import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { PersonsService } from '../persons/persons.service'
import { SimpleService } from '../../common/lib/simple.service'
import { LocationUtils } from '../../common/lib/location-utils'
import { IDumpster } from "../../data/interfaces/dumpster.interface"
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { IShopRegistration } from '../../data/interfaces/shop-registration.interface'
import { IBuildingMaterials } from "../../data/interfaces/buildingMaterials.interface"
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
        const cities = []
        if (document.cities && Array.isArray(document.cities))
          for (const city of document.cities)
            cities.push({'name': city})
        else if (document.cities)
          cities.push({'name': document.cities})
        document.cities = cities
        try {
          supplier = await this.model.create(document)
        } catch (e){
          await this.personService.delete(person)
          throw new HttpException(
            'Unable to sign up, Please contact admin support!',
            HttpStatus.NOT_ACCEPTABLE
          )
        }
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

    const cities = []
    if (document.cities && Array.isArray(document.cities))
      for (const city of document.cities)
        cities.push({'name': city})
    else if (document.cities)
      cities.push({'name': document.cities})
    document.cities = cities
    return await super.change(document)
  }

  async fetchAll(): Promise<IShopRegistration[]> {
    const data = await this.model
      .find({ status: 'Active', parent: null })
      .populate('person')
      .exec()
    return await this.insertSubSupplierCount(data)
  }

  async insertSubSupplierCount(data: IShopRegistration[]): Promise<IShopRegistration[]>{
    for (const supplier of data){
      supplier.__v = ((await this.getSubSuppliers(supplier._id)) as []).length
    }
    return data
  }

  async getSupplierIdsFromCityName(city: string, service: string): Promise<string[]> {
    const result: string[] = [];
    (await this.model
      .find({
        city: city,
        status: 'Active',
        services: service
      })
      .populate('person')
      .exec()).forEach(value => {result.push(value._id)})

    return result
  }

  async getSupplierFromCityName(city: string, service: string): Promise<IShopRegistration[]> {
    const result: IShopRegistration[] = [];
    (await this.model
      .find({
        city: city,
        status: 'Active',
        services: service
      })
      .populate('person')
      .exec()).forEach(value => {result.push(value)})

    return result
  }

  async getByService(service: string): Promise<IShopRegistration[]> {
    return await this.model
      .find({ status: 'Active', services: service })
      .populate('person')
      .exec()
  }

  async getSubSuppliers(parent: string): Promise<IShopRegistration[]> {
    return await this.model
      .find({ parent })
      .populate('person')
      .exec()
  }

  async getSuppliersByStatus(status: string): Promise<IShopRegistration[]> {
    const data = await this.model
      .find({ status })
      .populate('person')
      .exec()
    return await this.insertSubSupplierCount(data)
  }

  async getBlockedSuppliersWithoutParent(): Promise<IShopRegistration[]> {
    return await this.insertSubSupplierCount(await this.model
      .find({ status: 'Blocked', parent: null })
      .populate('person')
      .exec())
  }

  async changeSupplierStatus(
    id: string,
    status: string,
    message?: string
  ): Promise<IShopRegistration> {
    if (message)
      return await this.model.findByIdAndUpdate(id, { status, message }).exec()
    else {
      const supplier  = await this.model.findByIdAndUpdate(id, { status }).exec()
      if (status == 'Blocked') {
        const subSuppliers = await this.getSubSuppliers(id)
        for (const child of subSuppliers) {
          await this.model
            .findByIdAndUpdate(child._id, { status })
            .where('status', 'Active')
            .exec()
        }
      } else if (status == 'Active') {
        const subSuppliers = await this.model
          .find({ parent: id, status: 'Blocked' })
          .exec()
        for (const child of subSuppliers) {
          await this.model.findByIdAndUpdate(child._id, { status }).exec()
        }
      }
    return supplier
    }
  }

  async getAvailableServices(city: string): Promise<string[]> {
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

    return Array.from(newSet) as string[]
  }

  async getByProfile(person: string): Promise<IShopRegistration> {
    return await this.model
      .findOne({ person })
      .populate('person')
      .exec()
  }

  async getSupplierCities(): Promise<string[]> {
    const suppliers = await this.model.find().exec()
    const result = new Set()
    for (const item of suppliers) {
      result.add(item.city)
    }
    return Array.from(result) as string[]
  }

  async totalSuppliers(): Promise<number> {
    return await this.model
      .find({ status: 'Active' })
      .countDocuments()
      .exec()
  }

  //used in BuildingMaterial and Dumpster, creating here for code re-usability
  async checkPricingAccordingToSuppliers(document: IBuildingMaterials | IDumpster): Promise<IDumpster | IBuildingMaterials>{
    const objArr = []
    if (Array.isArray(document.suppliers)){
      for (let supplier of document.suppliers){
        supplier = (await this.fetch(supplier.toString())) as IShopRegistration
        let flag = false
        for (const price of document.pricing){
          // @ts-ignore
          if (price.city == supplier.city){
            flag = true
            break
          }
        }
        if (!flag){
          objArr.push(supplier.city)
        }
      }
    }else {
      const supplier = (await this.fetch(document.suppliers)) as IShopRegistration
      let flag = false
      for (const price of document.pricing){
        // @ts-ignore
        if (price.city == supplier.city){
          flag = true
          break
        }
      }
      if (!flag){
        objArr.push(supplier.city)
      }
    }

    if (objArr.length > 0)
      throw new HttpException(
        "Pricing required for these cities -> " + objArr.join(', '),
        HttpStatus.NOT_ACCEPTABLE
      )
    else
      return document
  }

  async finishingMaterialSuppliers(city: string, lat: string, lng: string): Promise<IShopRegistration[]>{
    const fmSupplier = await this.model
      .find({services: 'Finishing Material', parent: null})
      .populate('person')
      .exec()
    const result: IShopRegistration[] = []

    for (const supplier of fmSupplier){
      const sameCity: IShopRegistration[] = []

      const subSuppliers = await this.model
        .find({services: 'Finishing Material', parent: supplier._id})
        .populate('person')
        .exec() as IShopRegistration[]

      if (subSuppliers.length != 0){
        for (const oneSubSupplier of subSuppliers){
          if (oneSubSupplier.city == city || oneSubSupplier.cities.includes(city)){
            sameCity.push(oneSubSupplier)
          }
        }
      }

      if (supplier.city == city || supplier.cities.includes(city)){
        sameCity.push(supplier)
      }

      if (sameCity.length != 0){
        if (sameCity.length == 1)
          result.push(sameCity[0])
        else{
          const coordinates = []
          for (const single of sameCity){
            coordinates.push({
              'lat': single.location.longitude,
              'lng': single.location.longitude,
            })
          }

          const index = await LocationUtils.findNearestIndexOfCoordinateFromGivenLocation(coordinates, lat, lng)
          result.push(coordinates[index])
        }
      }
    }

    return result
  }

  async updateRating(id: string, rating: number): Promise<IShopRegistration>{
    const supplier = await this.model.findById(id).exec()
    if (supplier.rating){
      rating += supplier.rating
      rating /= 2
    }
    return await this.model.findByIdAndUpdate(id, {rating}).exec()
  }
}
