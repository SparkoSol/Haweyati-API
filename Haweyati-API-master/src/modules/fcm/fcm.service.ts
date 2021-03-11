import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { PersonsService } from '../persons/persons.service'
import { SimpleService } from '../../common/lib/simple.service'
import { IPerson } from '../../data/interfaces/person.interface'
import { IFcmAllHistory } from '../../data/interfaces/fcmAllHistory.interfce'
import { FcmStatus, IFcmHistory } from '../../data/interfaces/fcmHistory.interface'
import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common'

@Injectable()
export class FcmService extends SimpleService<IFcmHistory>{
  constructor(
    @InjectModel('fcmhistory')
    protected readonly fcmHistoryModel: Model<IFcmHistory>,
    @InjectModel('fcmall')
    protected readonly fcmAllHistoryModel: Model<IFcmAllHistory>,

    protected readonly personService: PersonsService,
    protected readonly http: HttpService
  )
  {
    super(fcmHistoryModel);
  }

  async sendAll(data: any): Promise<IFcmAllHistory>{
    try {
      await this.http.post(
        "https://fcm.googleapis.com/fcm/send",
        {
          notification: {
            title: data.title,
            body: data.body
          },
          data: {
            type: "news",
            createdAt: Date(),
            click_action: 'FLUTTER_NOTIFICATION_CLICK'
          },
          to: '/topics/news'
        },
        {
          headers: {
            "ContentType": "application/json",
            "Authorization": "key=" + process.env.FCM_AUTHORIZATION_KEY
          }
        }
      ).subscribe(asd => console.log('Notifications successfully sent to /topics/news'));
      return await this.fcmAllHistoryModel.create({
        title: data.title,
        body: data.body
      })
    } catch (e) {
      throw new HttpException(
        'Some Error Occurred!',
        HttpStatus.NOT_ACCEPTABLE
      )
    }
  }

  async sendSingle(data: any): Promise<IFcmHistory>{
    let flag = false;

    const person = (await this.personService.fetch(data.id)) as IPerson
    if (person.token){
      flag = true
      await this.http.post(
        "https://fcm.googleapis.com/fcm/send",
        {
          notification: {
            title: data.title,
            body: data.body,
          },
          data: {
            type: "order",
            createdAt: Date()
          },
          to: person.token
        },
        {
          headers: {
            "ContentType": "application/json",
            "Authorization": "key=" + process.env.FCM_AUTHORIZATION_KEY
          }
        }
      ).subscribe(asd => console.log('Notification successfully sent to #' + person.name));
    }

    if (flag){
      return await this.fcmHistoryModel.create({
        person: person,
        title: data.title,
        body: data.body,
        seen: false,
        status: FcmStatus.sent
      })
    }
    else {
      return await this.fcmHistoryModel.create({
        person: person,
        title: data.title,
        body: data.body,
        seen: false,
        status: FcmStatus.pending
      })
    }
  }

  async sendMultiple(tokens: string[], title: string, body: string): Promise<void>{
    for (const token of tokens){
      let flag = false;

      flag = true
      await this.http.post(
        "https://fcm.googleapis.com/fcm/send",
        {
          notification: {
            title,
            body,
          },
          data: {
            type: "order",
            createdAt: Date()
          },
          to: token
        },
        {
          headers: {
            "ContentType": "application/json",
            "Authorization": "key=" + process.env.FCM_AUTHORIZATION_KEY
          }
        }
      ).subscribe(asd => console.log('Notifications sent to multiple persons.'));
    }
  }

  async sendPending(id: string): Promise<void>{
    const pending = await this.fcmHistoryModel.find({person: id, status: FcmStatus.pending}).exec()
    if (pending.length > 0){
      const person = (await this.personService.fetch(id)) as IPerson
      if (person.token){
        for (const item of pending){
          await this.http.post(
            "https://fcm.googleapis.com/fcm/send",
            {
              notification: {
                title: item.title,
                body: item.body,
              },
              data: {
                type: "order",
                // @ts-ignore
                createdAt: item.createdAt
              },
              to: person.token
            },
            {
              headers: {
                "ContentType": "application/json",
                "Authorization": "key=" + process.env.FCM_AUTHORIZATION_KEY
              }
            }
          ).subscribe(asd => console.log('Pending Notification sent to #' + person.name));
          await this.fcmHistoryModel.findByIdAndUpdate(item._id, {status: FcmStatus.sent}).exec()
        }
      }
    }
  }

  async updateToken(data: any): Promise<IPerson>{
    const person = await this.personService.updateToken(data._id, data.token)
    this.sendPending(data._id)
    return person
  }

  async history(): Promise<IFcmAllHistory[]>{
    return await this.fcmAllHistoryModel.find().sort({createdAt: -1}).exec()
  }

  async personHistory(id: string): Promise<IFcmHistory[]>{
    return await this.fcmHistoryModel.find({person: id}).sort({createdAt: -1}).exec()
  }

  async personUnseenHistory(id: string): Promise<IFcmHistory[]>{
    return await this.fcmHistoryModel.find({person: id, seen: false}).sort({createdAt: -1}).exec()
  }

  async seenToUnseenHistory(person: string): Promise<any>{
    return await this.fcmHistoryModel.updateMany({person}, {seen: true}).exec()
  }
}
