import { Public } from '@libs/decorator';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DataBindingToken, JwtService, SignupDto, TokenInjectedUserDto, UserService } from '../application';

@ApiTags('user')
@Controller({ path: 'users', version: ['1'] })
export class UserController {
  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

  @Public()
  @ApiOperation({})
  @ApiCreatedResponse()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async fakeSignup(@Body() signupDto: SignupDto): Promise<DataBindingToken> {
    const user = await this.userService.signup(signupDto);
    const payload = TokenInjectedUserDto.create(user);
    const jwtToken = await this.jwtService.sign(payload);
    return new DataBindingToken(jwtToken, payload);
  }
}
