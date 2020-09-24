import { Model } from 'mongoose'
import { HttpService } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { IFcm } from '../../data/interfaces/fcm.interface'
import { PersonsService } from '../persons/persons.service'
import { SimpleService } from '../../common/lib/simple.service'
import { IFcmPending } from '../../data/interfaces/fcmPending.interface'
import { IFcmMessages } from '../../data/interfaces/fcmMessages.interface'

export class FcmService extends SimpleService<IFcm> {
  constructor(
    @InjectModel('fcm')
    protected readonly model: Model<IFcm>,

    @InjectModel('fcm-messages')
    protected readonly modelMessage: Model<IFcmMessages>,

    @InjectModel('fcm-pending')
    protected readonly modelPending: Model<IFcmPending>,

    private http: HttpService,

    private readonly personsService: PersonsService
  ) {
    super(model)
  }

  async getPersonHistory(id: string): Promise<IFcmMessages[]>{
    return await this.modelMessage.find({person: id}).exec()
  }

  async getFcmHistory(): Promise<IFcmMessages[]>{
    let all = await this.modelMessage.find().exec()
    for (let i =0 ; i< all.length; ++i){
      for (let j =0 ; j< all[i].person.length; ++j){
        all[i].person[j] = await this.personsService.fetchAll(all[i].person[j].toString())
      }
    }
    return all;
  }

  async notification(data: any) {
    let all = []
    if (Array.isArray(data.to)) {
      for (const item of data.to) {
        const one = await this.model.findById(item._id).exec()
        if (one){
          all.push(one)
        } else {
          const pending = await this.modelPending.findOne({person: item._id}).exec()
          if (pending){
            pending.messages.push({
              title: data.title,
              body : data.message
            })
            await this.modelPending.findByIdAndUpdate(pending._id, pending).exec()
          } else{
            await this.modelPending.create({
              person : item._id,
              messages : [{
                title : data.title,
                body : data.message
              }]
            })
          }
        }
      }
    }
    for (const a of all) {
      await this.http
        .post(
          'https://fcm.googleapis.com/fcm/send',
          {
            notification : {
              ...data
            },
            to: a.token
          },
          {
            headers: {
              ContentType: 'application/json',
              Authorization:
                'key=AAAANmpktLI:APA91bGjuD7CywoTVk3nHkixfeWCeDPIfQFGBqmkEiZPCVxvXYcy4aqaZRvVgXeHqODAZkGDanw0ovVEcUjb79_1dOvT9M6DX0wlrlTE2Ku1HXEvKw5-K--yMeXR2j77nH4NrSfVxyr_'
            }
          }
        )
        .subscribe(asd => console.log(asd))
    }
    await this.modelMessage.create({
      person : data.to,
      message : {
        title: data.title,
        body : data.message
      }
    })
  }
}
