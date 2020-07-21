import { Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPerson } from 'src/data/interfaces/person.interface';
import { SimpleService } from 'src/common/lib/simple.service';
import {IPersonVerification} from "../../data/interfaces/personVerification.interface";
// import * as dotenv from 'dotenv'
// dotenv.config()

@Injectable()
export class PersonsService extends SimpleService<any> {
    constructor
    (
        @InjectModel('persons')
        protected readonly model: Model<IPerson>,
        @InjectModel('personverification')
        protected readonly verificationmodel: Model<IPersonVerification>
    )
    {
        super(model)
    }

    async fetchFromContact(contact: string): Promise<IPerson>{
        return await this.model.findOne({contact: contact}).exec()
    }

    async fetch(id?: string): Promise<IPerson[] | IPerson> {
        if (id) return await this.model.findById(id).exec()
        return await this.model.find().exec()
    }

    fetchByUsername(name: string): Promise<IPerson> {
        return this.model.findOne().where('username', name).exec()
    }

    // randomIntFromInterval(min, max): string { // min and max included - for generating random number
    //     return (Math.floor(Math.random() * (max - min + 1) + min)).toString();
    // }
    //
    // async sendVerificationCode(personContact: IPerson) : Promise<IPerson> {
    //     const accountSid = process.env.TWILIO_ACC_SID; // Your Account SID from www.twilio.com/console
    //     const authToken = process.env.TWILIO_ACC_AUTH_TOKEN;
    //     // Your Auth Token from www.twilio.com/console
    //     // console.log(personContact)
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     // @ts-ignore
    //     const client = new twilio(accountSid, authToken);
    //     const code = this.randomIntFromInterval(1000, 9999);
    //     client.messages.create({
    //         body: 'Your Verification Code is '+ code,
    //         to: personContact.contact,  // Text this number
    //         from: process.env.TWILIO_NUMBER // From a valid Twilio number
    //     })
    //        .then(message => console.log(message.toJSON()))
    //       .catch(message => console.log(message))
    //
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     // @ts-ignore
    //     const person = await super.create(personContact)
    //     // console.log(person)
    //     const verify = new this.verificationmodel({
    //         Person: person,
    //         VerificationCode: code,
    //         Verified: false
    //     });
    //     await verify.save();
    //     return person;
    // }
    //
    // async verifyNumber(id: string, code: string): Promise<any> {
    //     console.log(id + '  ' + code )
    //     const data = (await this.verificationmodel.findOne({Person: id}).where('VerificationCode', code).exec()) as IPersonVerification
    //     if (data){
    //         return await this.verificationmodel.findByIdAndUpdate(data._id, {Verified: true}).exec()
    //     }
    //     else {
    //         return {
    //             message : "oops! User Verification Failed :(",
    //             person : await this.model.find().where("_id", id).exec()
    //         }
    //     }
    // }
}