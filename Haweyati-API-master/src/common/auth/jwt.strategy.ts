import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

/**
 *
 * @author arish <arishsultan104@gmail.com>
 */
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET' /// TODO: Add secret
    })
  }

  /**
   *
   * @param payload
   */
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username }
  }
}
