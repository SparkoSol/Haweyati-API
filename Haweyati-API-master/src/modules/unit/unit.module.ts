import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { MongooseModule } from '@nestjs/mongoose'
import { UnitController } from './unit.controller'
import { UnitSchema } from '../../data/schemas/unit.schema'

@Module({
  imports: [MongooseModule.forFeature([{name: 'unit', schema: UnitSchema}])],
  providers: [UnitService],
  controllers: [UnitController],
  exports: [UnitService]
})
export class UnitModule {}
