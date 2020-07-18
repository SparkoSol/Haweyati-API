import { HttpService } from "@nestjs/common";
import { SimpleService } from "../../common/lib/simple.service";
import { IFcm } from "../../data/interfaces/fcm.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IFcmMessages } from "../../data/interfaces/fcmMessages.interface";
import { IFcmPending } from "../../data/interfaces/fcmPending.interface";

export class FcmService extends SimpleService<IFcm>{
   constructor(
      @InjectModel('fcm')
      protected readonly model: Model<IFcm>,
      @InjectModel('fcm-messages')
      protected readonly modelMessage : Model<IFcmMessages>,
      @InjectModel('fcm-pending')
      protected readonly modelPending : Model<IFcmPending>,
      private http: HttpService
   ) {
      super(model);
   }

   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
   async notification(data : any){
      const mess = await this.model.find().exec()
      if (Array.isArray(mess)) {
         for (const a of mess){
            console.log({
               ...data,
               to: a.token
            })
            await this.http.post(
               "https://fcm.googleapis.com/fcm/send",
               {
                  ...data,
                  to: a.token
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
   }

}
