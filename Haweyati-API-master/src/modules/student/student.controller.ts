import { Controller, Get } from '@nestjs/common';
import { IStudent } from '../../data/interfaces/student.interface';

@Controller('student')
export class StudentController {

  @Get()
  student(){
    return 'workinnnn'
  }

  // @Get()
  // getAll(): Promise<IStudent | IStudent[]> {
  //   return this.service.fetch()
  // }

}
