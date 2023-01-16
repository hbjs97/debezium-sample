import { faker } from '@faker-js/faker';
import { StringFieldOptional, PasswordField, EmailField } from '@wim-backend/api-property';

export class SignupDto {
  @StringFieldOptional()
  readonly name: string = faker.name.fullName();

  @EmailField()
  readonly email!: string;

  @StringFieldOptional()
  readonly address: string = `${faker.address.city()} ${faker.address.streetAddress()}`;
}
