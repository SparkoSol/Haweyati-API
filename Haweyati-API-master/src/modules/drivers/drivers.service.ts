import { Injectable } from '@nestjs/common';
import {SimpleService} from "../../common/lib/simple.service";
import {IDriversInterface} from "../../data/interfaces/drivers.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { IDriverRequest } from '../../data/interfaces/driverRequest.interface';

@Injectable()
export class DriversService extends SimpleService<IDriversInterface>{
   constructor(
      @InjectModel('drivers') protected readonly model: Model<IDriversInterface>,
      @InjectModel('driverRequest') protected readonly requestModel: Model<IDriverRequest>
   )
   {
      super(model);
   }

   fetch(id?: string): Promise<IDriversInterface[] | IDriversInterface> {
      if (id) return this.model.findById(id).populate('profile').exec()
      return this.model.find().exec()
   }

   async create(document: IDriversInterface): Promise<IDriversInterface> {
      const data = await super.create(document);
      this.requestModel.create({
         driver: data._id,
         status: 'false'
      });
      return data;
   }

   async getRequests(): Promise<IDriverRequest[]> {
      const requests = await this.requestModel.find().exec();

      for (const req of requests) {
         req.driver = await this.fetch(req.driver.toString()) as IDriversInterface
      }

      return requests;
   }

   async getVerified(id: string): Promise<any> {
      const request = await this.requestModel.findById(id).exec();
      await this.model.findByIdAndUpdate(request.driver._id ,{status: 'true'}).exec();
      await this.requestModel.findByIdAndDelete(id);
      return {
         message : "Request Approved"
      }
   }

   async getRejected(id: string): Promise<any>{
      const request = await this.requestModel.findById(id).exec();
      await this.model.findByIdAndUpdate(request.driver._id ,{status: 'rejected'}).exec();
      await this.requestModel.findByIdAndDelete(id);
      return {
         message : "Request Rejected"
      }
   }

   async getBlocked(id: string): Promise<IDriversInterface> {
      return await this.model.findByIdAndUpdate(id, {status : 'blocked'}).exec();
   }
}
