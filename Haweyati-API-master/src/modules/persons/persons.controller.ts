import { IPerson } from 'src/data/interfaces/person.interface';
import { Body, Controller, Post } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { SimpleController } from 'src/common/lib/simple.controller';
import { SecuredController } from 'src/common/lib/secured.controller';
import { IDumpster } from '../../data/interfaces/dumpster.interface';
import {IPersonVerification} from "../../data/interfaces/personVerification.interface";

@Controller('persons')
export class PersonsController extends SimpleController<IPerson> {
    constructor(protected readonly service: PersonsService) {
        super(service)
    }
    @Post()
    sendVerificationCode(@Body() contact: any): Promise<IPersonVerification>{
        return this.service.sendVerificationCode(contact.contact);
    }
    @Post('verify')
    verifyNumber(@Body() contact: string, code: string): Promise<string>{
        return this.service.verifyNumber(contact, code);
    }
}
