import { BaseEntity } from '@libs/base';
import { DatetimeToTimestampTransformer } from '@libs/transformer';
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('product')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  override id!: string;

  @Column('varchar')
  name!: string;

  @Column()
  price!: number;

  @UpdateDateColumn({ width: 6, nullable: true, transformer: new DatetimeToTimestampTransformer() })
  updatedAt!: number | null;

  static from({ name, price }: { name: string; price: number }): Product {
    const product = new Product();
    product.name = name;
    product.price = price;
    return product;
  }

  validate(): void {}
}
