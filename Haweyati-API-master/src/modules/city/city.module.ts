import { Module } from '@nestjs/common'
import { CityService } from './city.service'
import { MongooseModule } from '@nestjs/mongoose'
import { CityController } from './city.controller'
import { CitySchema } from '../../data/schemas/city.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'city', schema: CitySchema }])],
  providers: [CityService],
  controllers: [CityController]
})
export class CityModule {
}
