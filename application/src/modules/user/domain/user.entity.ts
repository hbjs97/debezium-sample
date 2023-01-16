import { BaseEntity } from '@libs/base';
import { DatetimeToTimestampTransformer } from '@libs/transformer';
import { Generator } from '@libs/util';
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

interface CreateUserProps {
  id?: string;
  name: string;
  email: string;
  address: string;
}

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  override id!: string;

  @Column('varchar')
  name!: string;

  @Column('varchar', { length: 100, unique: true })
  email!: string;

  @Column('varchar')
  address!: string;

  @UpdateDateColumn({ width: 6, nullable: true, transformer: new DatetimeToTimestampTransformer() })
  updatedAt!: number | null;

  static create(props: CreateUserProps): User {
    const user = new User();
    user.id = Generator.uuid();
    user.name = props.name;
    user.email = props.email;
    user.address = props.address;
    return user;
  }

  validate(): void {}
}
