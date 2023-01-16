import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { User } from '../domain';
import { UserCommandRepository, UserQueryRepository } from '../infrastructure';
import { SignupDto, UserDto } from './dto';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(private readonly query: UserQueryRepository, private readonly command: UserCommandRepository) {}

  async findUserByEmail(email: string): Promise<UserDto | undefined> {
    const user = await this.query.findUserByEmail(email);
    return user ? UserDto.from(user) : undefined;
  }

  async signup(signupDto: SignupDto): Promise<User> {
    const exist = await this.findUserByEmail(signupDto.email);
    if (exist) throw new ConflictException('중복된 이메일입니다.');
    return this.command.save(User.create(signupDto));
  }
}
