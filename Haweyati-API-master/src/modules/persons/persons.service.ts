import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IPerson } from 'src/data/interfaces/person.interface'
import { SimpleService } from 'src/common/lib/simple.service'
import * as blake2 from 'blake2'
import * as nodeMailer from 'nodemailer'
import { IAdminForgotPassword } from '../../data/interfaces/adminForgotPassword.interface'
import * as moment from 'moment'

@Injectable()
export class PersonsService extends SimpleService<any> {
  constructor(
    @InjectModel('persons')
    protected readonly model: Model<IPerson>,
    @InjectModel('forgotpassword')
    protected readonly forgotPasswordModel: Model<IAdminForgotPassword>
  ) {
    super(model)
  }

  async fetchFromContact(contact: string): Promise<IPerson> {
    return await this.model.findOne({ contact: contact }).exec()
  }

  async create(data: any): Promise<any> {
    const profile = await this.fetchFromContact(data.contact)
    data.username = data.contact
    console.log(profile)
    if (profile) {
      if (Array.isArray(data.scope)) {
        if (profile.scope.includes(data.scope[0])) {
          throw new HttpException(
            'Profile with this contact already exists!',
            HttpStatus.NOT_ACCEPTABLE
          )
        } else {
          profile.scope.push(data.scope[0])
          return await this.change(profile)
        }
      } else {
        if (profile.scope.includes(data.scope)) {
          throw new HttpException(
            'Profile with this contact already exists!',
            HttpStatus.NOT_ACCEPTABLE
          )
        } else {
          profile.scope.push(data.scope)
          return await this.change(profile)
        }
      }
    } else {
      return await super.create(data)
    }
  }

  async fetch(id?: string): Promise<IPerson[] | IPerson> {
    if (id) {
      const data = await this.model.findById(id).exec()
      console.log(data)
      data.password = ''
      return data
    } else {
      const all = await this.model.find().exec()

      for (let data of all) {
        data.password = ''
      }
      return all
    }
  }

  async fetchAll(id: string): Promise<IPerson>{
    return await this.model.findById(id).exec()
  }

  async fetchByUsername(name: string): Promise<IPerson> {
    return await this.model
      .findOne()
      .where('username', name)
      .exec()
  }

  async change(document: any): Promise<any> {
    if (document.password) {
      const person = (await this.model.findById(document._id).exec()) as IPerson
      if (person.password == document.old) {
        person.password = document.password
        return super.change(document)
      } else {
        throw new HttpException(
          'Old Password Not Matched!',
          HttpStatus.NOT_ACCEPTABLE
        )
      }
    } else {
      return await this.model.findByIdAndUpdate(document._id, document).exec()
    }
  }

  async exceptAdmin(): Promise<IPerson[]> {
    // @ts-ignore
    const data = await this.model.find({ scope: { $nin: 'Admin' } }).exec()
    // for (let i=0; i<data.length; ++i){
    //   if (data[i].scope.includes('supplier') || data[i].scope.includes('customer') || data[i].scope.includes('driver')) {}
    //   else
    //     data.splice(i, 1)
    // }
    return data
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected getRandomArbitrary() {
    return (Math.random() * (999999 - 100000) + 100000).toFixed(0)
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
      .findOne({ email: email, scope: 'Admin' })
      .exec()

    if (person) {
      //Random Code Generation
      const code = this.getRandomArbitrary()
      console.log(code)

      //Hashing
      const h = blake2.createHash('blake2b')
      h.update(Buffer.from(code))
      const hash = h.digest('hex')

      //Email Sending
      const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'zainkhan.official10@gmail.com',
          pass: 'mynewgmail'
        }
      })
      const info = await transporter.sendMail({
        from: '"Zain Khan - Developer ACP" <zainkhan.official10@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Haweyati Admin Forgot Password', // Subject line
        text: '', // plain text body
        html:
          '<button onclick="">Click Here</button>' +
          ' http://192.168.100.23:3000/auth/reset-password/' +
          hash // html body
      })
      console.log('Message sent: %s', info.messageId)

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

    console.log(person)
    console.log(verify)
    console.log(data)
    if (person) {
      await this.model.findByIdAndDelete(verify._id).exec()
      return await this.model
        .findByIdAndUpdate(person._id, { password: data.password})
        .exec()
    }
  }
}
