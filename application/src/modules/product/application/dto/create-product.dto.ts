import { NumberField, StringField } from '@wim-backend/api-property';

export class CreateProductDto {
  @StringField()
  readonly name!: string;

  @NumberField()
  readonly price!: number;
}
