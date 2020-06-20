import { Controller } from '@nestjs/common';
import { SimpleController } from 'src/common/lib/simple.controller';
import { SecuredController } from 'src/common/lib/secured.controller';
import { IDumpsterAvailability } from '../../data/interfaces/dumpsterAvailability';
import { DumpsterAvailabilityService } from './dumpster-availability.service';

@Controller('dumpster-availability')
export class DumpsterAvailabilityController extends SimpleController<IDumpsterAvailability> {
  constructor(protected readonly service: DumpsterAvailabilityService) {
    super(service)
  }


}
