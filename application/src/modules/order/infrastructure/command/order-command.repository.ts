import { BaseCommandRepo } from '@libs/base';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from '../../domain';

@Injectable()
export class OrderCommandRepository extends BaseCommandRepo<Order> {
  constructor(@InjectRepository(Order) private readonly commandRepository: Repository<Order>) {
    super(commandRepository);
  }
}
