import { StringField } from '@wim-backend/api-property';
import { UserDto } from '../..';

export interface ITokenInjectedUserDto {
  id: string;
  name: string;
  email: string;
  address: string;
}

export class TokenInjectedUserDto implements ITokenInjectedUserDto {
  @StringField()
  readonly id!: string;

  @StringField()
  readonly name!: string;

  @StringField()
  readonly email!: string;

  @StringField()
  readonly address!: string;

  constructor({id,name,email,address}: TokenInjectedUserDto) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.address = address;
  }

  static create(tokenInjectedUserDto: TokenInjectedUserDto): ITokenInjectedUserDto {
    return new TokenInjectedUserDto(tokenInjectedUserDto);
  }

  static from(user: UserDto): ITokenInjectedUserDto {
    return new TokenInjectedUserDto({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
    });
  }
}
