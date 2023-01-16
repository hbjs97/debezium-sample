import { BaseEntity } from '@libs/base';
import { DatetimeToTimestampTransformer } from '@libs/transformer';
import { Product } from 'src/modules/product';
import { User } from 'src/modules/user';
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('order')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  override id!: string;

  @Column('uuid')
  userId!: string;

  @Column()
  productId!: string;

  @UpdateDateColumn({ width: 6, nullable: true, transformer: new DatetimeToTimestampTransformer() })
  updatedAt!: number | null;

  static from({ userId, productId }: { userId: string; productId: string }): Order {
    const order = new Order();
    order.userId = userId;
    order.productId = productId;
    return order;
  }

  static of(user: User, product: Product): Order {
    const order = new Order();
    order.userId = user.id;
    order.productId = product.id;
    return order;
  }

  validate(): void {}
}
