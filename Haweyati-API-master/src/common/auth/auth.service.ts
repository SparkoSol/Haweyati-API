import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'
import { PersonsService } from 'src/modules/persons/persons.service'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: PersonsService
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.fetchByUsername(username)

    if (user && user.password === pass) {
      user.password = undefined

      return user
    }

    return null
  }

  async signIn(user: any) {
    return {
      access_token: await this.jwtService.signAsync({
        username: user.username,
        sub: user._id
      })
    }
  }

  async profile(user: any) {
    return { user: await this.usersService.fetch(user.userId) }
  }
}
