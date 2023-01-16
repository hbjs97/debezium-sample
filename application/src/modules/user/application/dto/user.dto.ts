import { StringField } from '@wim-backend/api-property';
import { User } from '../../domain';

export class UserDto {
  @StringField()
  id!: string;

  @StringField()
  name!: string;

  @StringField()
  email!: string;

  @StringField()
  address!: string;

  static from(user: User): UserDto {
    const dto = new UserDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    dto.address = user.address;
    return dto;
  }
}
