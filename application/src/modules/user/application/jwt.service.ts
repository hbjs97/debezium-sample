import { ConfigService } from '@libs/config';
import { msToSecond } from '@libs/util';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { isInteger } from 'lodash';
import ms from 'ms';
import { JwtToken, TokenInjectedUserDto } from 'src/modules/user';

@Injectable()
export class JwtService {
  private readonly accessSecret: string;
  private readonly accessTokenExpireTime: number;

  constructor(private readonly configService: ConfigService, private readonly jwtService: NestJwtService) {
    this.accessSecret = configService.get('jwtAccessSecret');
    this.accessTokenExpireTime = msToSecond(ms('1 days'));

    if (!this.accessSecret) throw new Error('accessSecret 값이 적절하지 않습니다.');
    if (!isInteger(this.accessTokenExpireTime)) throw new Error('accessTokenExpireTime 값이 적절하지 않습니다.');
  }

  /**
   * @description
   * 로그인 하며 jwt를 캐시한다.
   */
  async sign(payload: TokenInjectedUserDto): Promise<JwtToken> {
    try {
      const accessToken = await this.jwtService.signAsync(instanceToPlain(payload), { secret: this.accessSecret, expiresIn: this.accessTokenExpireTime });
      return new JwtToken(accessToken);
    } catch (error) {
      throw new UnauthorizedException('jwt sign failed.');
    }
  }
}
