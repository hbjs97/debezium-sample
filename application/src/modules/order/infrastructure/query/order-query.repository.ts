import { BaseQueryRepo } from '@libs/base';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../domain';

@Injectable()
export class OrderQueryRepository extends BaseQueryRepo<Order> {
  protected readonly entityName: string = Order.name;
  protected readonly relations: string[] = [];

  constructor(@InjectRepository(Order) private readonly orderQueryRepository: Repository<Order>) {
    super(orderQueryRepository);
  }
}
