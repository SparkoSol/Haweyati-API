import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'
// import { UsersModule } from '../../modules/administrator/users/users.module'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { PersonsService } from 'src/modules/persons/persons.service'
import { PersonsModule } from 'src/modules/persons/persons.module'

@Module({
  imports: [
    PersonsModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'SECRET', /// TODO: Setup secret.
        signOptions: { expiresIn: '12 hours' }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
