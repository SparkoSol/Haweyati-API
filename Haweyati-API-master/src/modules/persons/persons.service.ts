import * as twilio from 'twilio'
import { Injectable , Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPerson } from 'src/data/interfaces/person.interface';
import { SimpleService } from 'src/common/lib/simple.service';
import {IPersonVerification} from "../../data/interfaces/personVerification.interface";

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
    async sendVerificationCode(personContact: string) : Promise<IPersonVerification> {
        const accountSid = 'AC30e02921170b59ec5f6a0c6cd26fbc19'; // Your Account SID from www.twilio.com/console
        const authToken = '48058af1fdcbc650819bedddbe60ac66';   // Your Auth Token from www.twilio.com/console

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const client = new twilio(accountSid, authToken);
        const code = this.randomIntFromInterval(1000, 9999);
        client.messages.create({
            body: 'Your Verification Code is '+ code,
            to: personContact,  // Text this number
            from: '+12029464159' // From a valid Twilio number
        })
            .then((message) => console.log(message.sid));
        // const findPerson = await this.model.findById({contact: personContact}).exec()

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const person = await super.create({ contact: personContact })

        const verify = new this.verificationmodel({
            Person: person,
            VerificationCode: code,
            Verified: false
        });
        return await verify.save();
    }

    async verifyNumber(contactNumber: string, code: string): Promise<string> {
        const person = this.model.findById('contact', contactNumber);
        const found = this.verificationmodel.findById('Person', person)
        const newObj = new this.verificationmodel(found);
        newObj.Verified = true;
        this.verificationmodel.findByIdAndUpdate(newObj.id, newObj, {new:true});
        return "User Verified Successfully";
    }
}