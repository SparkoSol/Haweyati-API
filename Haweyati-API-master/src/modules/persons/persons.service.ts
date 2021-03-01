import { Model } from 'mongoose'
import * as moment from 'moment'
import { InjectModel } from '@nestjs/mongoose'
import { EmailUtils } from '../../common/lib/email-utils'
import { SimpleService } from 'src/common/lib/simple.service'
import { IPerson } from 'src/data/interfaces/person.interface'
import { NoGeneratorUtils } from '../../common/lib/no-generator-utils'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { IAdminForgotPassword } from '../../data/interfaces/adminForgotPassword.interface'

@Injectable()
export class PersonsService extends SimpleService<IPerson> {
  constructor(
    @InjectModel('persons')
    protected readonly model: Model<IPerson>,
    @InjectModel('forgotpassword')
    protected readonly forgotPasswordModel: Model<IAdminForgotPassword>,
  ) {
    super(model)
  }

  async fetchFromContact(contact: string): Promise<IPerson> {
    return await this.model.findOne({ contact: contact }).exec()
  }

  async create(data: any): Promise<any> {
    if (!data.email) {
      data.email = undefined
      await this.model
        .updateOne({ _id: data._id }, { $unset: { email: 1 } })
        .exec()
      delete data.email
    }
    else if (await this.model.findOne({email: data.email}).exec())
      throw new HttpException(
        "Email Already Exists!",
        HttpStatus.NOT_ACCEPTABLE
      )

    let person = await super.create(data)
    person = await this.fetchByUsername(person.contact)
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
    if (document.old) {
      person = await this.model
        .findOneAndUpdate(
          { _id: document._id, password: document.old },
          document
        )
        .exec()
      if (person) {
        return person
      } else {
        throw new HttpException(
          'Old Password Not Matched!',
          HttpStatus.NOT_ACCEPTABLE
        )
      }
    } else {
      try {
        if (!document.email) {
          document.email = undefined
          await this.model
            .updateOne({ _id: document._id }, { $unset: { email: 1 } })
            .exec()
          delete document.email
        }
        if (document.image && document.email)
          person = await this.model
            .findByIdAndUpdate(document._id, {
              name: document.name,
              email: document.email,
              image: document.image
            })
            .exec()
        else if (document.image)
          person = await this.model
            .findByIdAndUpdate(document._id, {
              name: document.name,
              image: document.image
            })
            .exec()
        else if (document.email)
          person = await this.model
            .findByIdAndUpdate(document._id, {
              name: document.name,
              email: document.email
            })
            .exec()
        else
          person = await this.model
            .findByIdAndUpdate(document._id, { name: document.name })
            .exec()
      } catch {
        throw new HttpException(
          'Email Already Exists!',
          HttpStatus.NOT_ACCEPTABLE
        )
      }
    }
    return person
  }

  async scopeConversion(document: any): Promise<IPerson> {
    const person = (await this.model
      .findOne({ contact: document.contact })
      .exec()) as IPerson
    person.scope.push('customer')
    for (let i = 0; i < person.scope.length; ++i) {
      if (person.scope[i] == 'guest') {
        person.scope.splice(i, 1)
        break
      }
    }
    person.name = document.name
    person.password = document.password
    return await person.save()
  }

  async exceptAdmin(): Promise<IPerson[]> {
    // @ts-ignore
    return await this.model.find({ scope: { $nin: 'Admin' } }).exec()
  }

  async verifyHash(hash: string): Promise<boolean> {
    return (
      moment().diff(
        (await this.forgotPasswordModel.findOne({ hash: hash }).exec())
          // @ts-ignore
          .createdAt,
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
        .findByIdAndUpdate(person._id, { password: data.password })
        .exec()
    }
  }

  async search(query: any) {
    return await this.model
      .find({
        $or: [
          { name: { $regex: query.name, $options: 'i' } },
          { contact: { $regex: query.name, $options: 'i' } }
        ]
      })
      .exec()
  }

  async updatePassword(document: any): Promise<IPerson> {
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
    return this.model
      .updateOne({ contact: data.contact }, { password: data.password })
      .exec()
  }

  async isContactExists(contact: string): Promise<IPerson> {
    return await this.model.findOne({ contact }).exec()
  }

  //for adding scope in existing person used in driver
  async addScope(id: string, scope: string): Promise<IPerson> {
    const person = await this.model.findById(id).exec()
    if (!person.scope.includes(scope))
      person.scope.push(scope)
    return await person.save()
  }

  //changing token on logout
  async logout(id: string) {
    return await this.model.findByIdAndUpdate(id, { token: undefined }).exec()
  }

  //updating token on person login - not used in persons service because of circular dependency
  async updateToken(id: string, token: string) {
    return await this.model.findByIdAndUpdate(id, { token }).exec()
  }
}
