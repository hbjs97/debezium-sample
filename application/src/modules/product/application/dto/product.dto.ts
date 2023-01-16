import { NumberField, StringField } from '@wim-backend/api-property';
import { Product } from '../../domain';

export class ProductDto {
  @StringField()
  readonly name!: string;

  @NumberField()
  readonly price!: number;

  private constructor({ name, price }: { name: string; price: number }) {
    this.name = name;
    this.price = price;
  }

  static from({ name, price }: Product): ProductDto {
    return new ProductDto({ name, price });
  }
}
