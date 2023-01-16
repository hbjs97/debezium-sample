import { NumberField, StringField } from '@wim-backend/api-property';

export class CreateOrderDto {
  @StringField()
  readonly productId!: string;
}
