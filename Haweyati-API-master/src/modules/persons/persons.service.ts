import * as twilio from 'twilio'
import { Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPerson } from 'src/data/interfaces/person.interface';
import { SimpleService } from 'src/common/lib/simple.service';
import {IPersonVerification} from "../../data/interfaces/personVerification.interface";
import * as dotenv from 'dotenv'
dotenv.config()

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

    fetchByUsername(name: string): Promise<IPerson> {
        return this.model.findOne().where('username', name).exec()
    }
    randomIntFromInterval(min, max): string { // min and max included - for generating random number
        return (Math.floor(Math.random() * (max - min + 1) + min)).toString();
    }
    async sendVerificationCode(personContact: any) : Promise<IPersonVerification> {
        const accountSid = process.env.TWILIO_ACC_SID; // Your Account SID from www.twilio.com/console
        const authToken = process.env.TWILIO_ACC_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const client = new twilio(accountSid, authToken);
        const code = this.randomIntFromInterval(1000, 9999);
        client.messages.create({
            body: 'Your Verification Code is '+ code,
            to: personContact.contact,  // Text this number
            from: process.env.TWILIO_NUMBER // From a valid Twilio number
        })

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const person = await super.create(personContact)

        const verify = new this.verificationmodel({
            Person: person,
            VerificationCode: code,
            Verified: false
        });
        await verify.save();
        return person;
    }

    async verifyNumber(id: string, code: string): Promise<any> {
        try {
            await this.verificationmodel.findOneAndUpdate({
                Person: id, VerificationCode: code
            }, {
                Verified: true
            }).exec();
            return {
                message : "User Verification Successful!",
                person : await this.model.find().where("_id", id).exec()
            }
        }
        catch (e) {
            return {
                message : "User Verification Unsuccessful!"
            }
        }
    }
}