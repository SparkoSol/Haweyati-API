import { Injectable, UnauthorizedException } from '@nestjs/common'

import { IUser } from './users/user.interface'
import { Strategy } from 'passport-local'
import { AuthService } from './auth.service'
import { PassportStrategy } from '@nestjs/passport'

/**
 *
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private service: AuthService) {
    super()
  }

  /**
   *
   * @param username
   * @param password
   *
   * @return Promise<User>
   */
  async validate(username: string, password: string): Promise<IUser> {
    const user = await this.service.validateUser(username, password)

    if (!user) throw new UnauthorizedException()

    return user
  }
}
