import { StringField } from '@wim-backend/api-property';

export class JwtToken {
  constructor(_accessToken: string) {
    this.accessToken = _accessToken;
  }

  @StringField()
  readonly accessToken: string;
}
