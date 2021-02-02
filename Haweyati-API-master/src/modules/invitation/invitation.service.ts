import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { SimpleService } from '../../common/lib/simple.service'
import { IInvitationCode } from '../../data/interfaces/invitationCode.interface'

@Injectable()
export class InvitationService extends SimpleService<IInvitationCode>{
  constructor(@InjectModel('invitation') protected readonly model: Model<IInvitationCode>) {
    super(model);
  }

  create(document: any): Promise<IInvitationCode> {
    console.log(document)
    const obj: any = {
      person: document._id,
      code: document._id.toString().slice(-5),
      points: 500
    }
    return super.create(obj)
  }
}
