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
  ) {
    super(fcmHistoryModel);
  }

  async sendAll(data: any){
    try {
      await this.http.post(
        "https://fcm.googleapis.com/fcm/send",
        {
          notification: {
            title: data.title,
            body: data.body
          },
          to: '/topics/news'
        },
        {
          headers: {
            "ContentType": "application/json",
            "Authorization": "key=AAAANmpktLI:APA91bGjuD7CywoTVk3nHkixfeWCeDPIfQFGBqmkEiZPCVxvXYcy4aqaZRvVgXeHqODAZkGDanw0ovVEcUjb79_1dOvT9M6DX0wlrlTE2Ku1HXEvKw5-K--yMeXR2j77nH4NrSfVxyr_"
          }
        }
      ).subscribe(asd => console.log(asd));
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

  async sendSingle(data: any){
    let flag: boolean = false;

    const person = (await this.personService.fetch(data.id)) as IPerson
    if (person.token){
      flag = true
      await this.http.post(
        "https://fcm.googleapis.com/fcm/send",
        {
          notification: {
            title: data.title,
            body: data.body
          },
          to: person.token
        },
        {
          headers: {
            "ContentType": "application/json",
            "Authorization": "key=AAAANmpktLI:APA91bGjuD7CywoTVk3nHkixfeWCeDPIfQFGBqmkEiZPCVxvXYcy4aqaZRvVgXeHqODAZkGDanw0ovVEcUjb79_1dOvT9M6DX0wlrlTE2Ku1HXEvKw5-K--yMeXR2j77nH4NrSfVxyr_"
          }
        }
      ).subscribe(asd => console.log(asd));
    }

    if (flag){
      return await this.fcmHistoryModel.create({
        person: person,
        title: data.title,
        body: data.body,
        status: FcmStatus.sent
      })
    }
    else {
      return await this.fcmHistoryModel.create({
        person: person,
        title: data.title,
        body: data.body,
        status: FcmStatus.pending
      })
    }
  }

  async sendPending(id: string){
    const pending = await this.fcmHistoryModel.find({person: id, status: FcmStatus.pending}).exec()
    if (pending.length > 0){
      const person = (await this.personService.fetch(id)) as IPerson
      if (person.token){
        for (let item of pending){
          await this.http.post(
            "https://fcm.googleapis.com/fcm/send",
            {
              notification: {
                title: item.title,
                body: item.body
              },
              to: person.token
            },
            {
              headers: {
                "ContentType": "application/json",
                "Authorization": "key=AAAANmpktLI:APA91bGjuD7CywoTVk3nHkixfeWCeDPIfQFGBqmkEiZPCVxvXYcy4aqaZRvVgXeHqODAZkGDanw0ovVEcUjb79_1dOvT9M6DX0wlrlTE2Ku1HXEvKw5-K--yMeXR2j77nH4NrSfVxyr_"
              }
            }
          ).subscribe(asd => console.log(asd));
          await this.fcmHistoryModel.findByIdAndDelete(item._id).exec()
        }
      }
    }
    return
  }

  async testing(data: any){
    await this.http.post(
      "https://fcm.googleapis.com/fcm/send",
      {
        notification: {
          title: data.title,
          body: data.body
        },
        to: 'c8YDRWmLRn2nSP6LNV-A4T:APA91bHFatGX8715wn3RupaJ_y6NVrHwddPDtwikha3alBwty_SpWz0ka2ugOS8CtTjmQhzcz_JNkk6AeppAn6RyqAhIpi8Fes3MXrYx5KVqU0nZCLuJeSN6R9nD92-gzRcR-25nmr-S'
      },
      {
        headers: {
          "ContentType": "application/json",
          "Authorization": "key=AAAANmpktLI:APA91bGjuD7CywoTVk3nHkixfeWCeDPIfQFGBqmkEiZPCVxvXYcy4aqaZRvVgXeHqODAZkGDanw0ovVEcUjb79_1dOvT9M6DX0wlrlTE2Ku1HXEvKw5-K--yMeXR2j77nH4NrSfVxyr_"
        }
      }
    ).subscribe(asd => console.log(asd));
  }
}
