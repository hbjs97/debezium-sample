import { JsonField, NumberField, StringField } from '@wim-backend/api-property';
import { Product, ProductDto } from 'src/modules/product';
import { User, UserDto } from 'src/modules/user';

export class OrderDto {
  @JsonField({ type: UserDto })
  readonly user!: UserDto;

  @JsonField({ type: ProductDto })
  readonly product!: ProductDto;

  private constructor({ user, product }: { user: User; product: Product }) {
    this.user = UserDto.from(user);
    this.product = ProductDto.from(product);
  }

  static of(user: User, product: Product): OrderDto {
    return new OrderDto({ user, product });
  }
}
