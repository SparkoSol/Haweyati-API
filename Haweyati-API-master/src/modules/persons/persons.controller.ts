import { IPerson } from 'src/data/interfaces/person.interface';
import { Body, Controller, Patch, Post } from '@nestjs/common';
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
    sendVerificationCode(@Body() person: any): Promise<IPersonVerification>{
        return this.service.sendVerificationCode(person);
    }
    @Patch('verify')
    verify(@Body() input: any): Promise<any>{
        return this.service.verifyNumber(input.id, input.code);
    }
}
