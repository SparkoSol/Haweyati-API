import { Model } from 'mongoose'
import * as moment from 'moment'
import { InjectModel } from '@nestjs/mongoose'
import { EmailUtils } from '../../common/lib/email-utils'
import { SimpleService } from 'src/common/lib/simple.service'
import { IPerson } from 'src/data/interfaces/person.interface'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { NoGeneratorUtils } from '../../common/lib/no-generator-utils'
import { ImageConversionUtils } from '../../common/lib/image-conversion-utils'
import { IAdminForgotPassword } from '../../data/interfaces/adminForgotPassword.interface'
import { InvitationService } from '../invitation/invitation.service'

@Injectable()
export class PersonsService extends SimpleService<IPerson> {
  constructor(
    @InjectModel('persons')
    protected readonly model: Model<IPerson>,
    @InjectModel('forgotpassword')
    protected readonly forgotPasswordModel: Model<IAdminForgotPassword>,

    protected readonly invitationService: InvitationService
  ) {
    super(model)
  }

  async fetchFromContact(contact: string): Promise<IPerson> {
    return await this.model.findOne({ contact: contact }).exec()
  }

  async create(data: any): Promise<any> {
    const person = await super.create(data)
    await this.invitationService.create(person)
    if (person.image){
      await ImageConversionUtils.toWebp(process.cwd()+"\\"+person.image.path, process.cwd()+"\\..\\uploads\\"+person.image.name, 20)
    }
    return person
  }

  async fetchByUsername(name: string): Promise<IPerson> {
    return await this.model
      .findOne()
      .where('username', name)
      .exec()
  }

  async change(document: any): Promise<any> {
    let person: IPerson
    if (document.old){
      person = await this.model.findOneAndUpdate({_id: document._id, password: document.old}, document).exec()
      if (person){
        return person
      }else {
        throw new HttpException(
          'Old Password Not Matched!',
          HttpStatus.NOT_ACCEPTABLE
        )
      }
    }
    else {
      person = await super.change(document)
    }
    // if (person.image){
    //   await ImageConversionUtils.toWebp(process.cwd()+"\\"+person.image.path, process.cwd()+"\\..\\uploads\\"+person.image.name, 20)
    // }
    return person
  }

  async exceptAdmin(): Promise<IPerson[]> {
    // @ts-ignore
    return await this.model.find({ scope: { $nin: 'Admin' } }).exec()
  }

  async verifyHash(hash: string): Promise<boolean> {
    return (
      moment().diff(
        // @ts-ignore
        (await this.forgotPasswordModel.findOne({ hash: hash }).exec()).createdAt,
        'hours'
      ) < 1
    )
  }

  async forgotPassword(email: string) {
    const person = await this.model
      .findOne({ email: email, scope: 'admin' })
      .exec()

    if (person) {
      const hash = await NoGeneratorUtils.generateCode()

      const emailInfo = await EmailUtils.sendEmail(person.name, hash, email)
      // console.log('Message sent: %s', emailInfo.messageId)

      //Store in DB
      const document = {
        hash: hash,
        email: email
      }
      return await this.forgotPasswordModel.create(document)
    } else {
      throw new HttpException(
        "Admin Email Don't exists!",
        HttpStatus.NOT_ACCEPTABLE
      )
    }
  }

  async changePassword(data: any): Promise<any> {
    let verify, person
    if (data.hash) {
      verify = await this.forgotPasswordModel
        .findOne({ hash: data.hash })
        .exec()
      if (verify && this.verifyHash(data.hash))
        person = (await this.model.findOne({ email: verify.email })) as IPerson
      else {
      throw new HttpException(
        'You Request Has Expired!',
        HttpStatus.NOT_ACCEPTABLE
      )
    }
    } else {
      throw new HttpException('No Hash!', HttpStatus.NOT_ACCEPTABLE)
    }
    if (person) {
      await this.model.findByIdAndDelete(verify._id).exec()
      return await this.model
        .findByIdAndUpdate(person._id, { password: data.password})
        .exec()
    }
  }

  async search(query : any){
    return await this.model
      .find({
        $or: [{ 'name': { $regex: query.name, $options: "i" } },
          { 'contact': { $regex: query.name, $options: "i" } }
        ]
      }).exec()
  }

  async updatePassword(document: any): Promise<IPerson>{
    const person = (await this.model.findById(document._id).exec()) as IPerson
    // @ts-ignore
    if (person.password == document.old) {
      person.password = document.password
      return await super.change(person)
    } else {
      throw new HttpException(
        'Old Password Not Matched!',
        HttpStatus.NOT_ACCEPTABLE
      )
    }
  }

  async changePasswordWithContact(data: any): Promise<any> {
    return this.model.updateOne({ contact: data.contact }, { password: data.password }).exec()
  }

  async isContactExists(contact: string): Promise<IPerson>{
    return await this.model.findOne({contact}).exec()
  }

  //for adding scope in existing person used in driver
  async addScope(id: string, scope: string): Promise<IPerson>{
    let person = await this.model.findById(id).exec()
    person.scope.push(scope)
    return await person.save()
  }

  //changing token on logout
  async logout(id: string){
    return await this.model.findByIdAndUpdate(id, {token: undefined}).exec()
  }

  //updating token on person login - not used in persons service because of circular dependency
  async updateToken(id:string, token:string){
    return await this.model.findByIdAndUpdate(id, {token}).exec()
  }
}
