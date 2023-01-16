import { BaseCommandRepo } from '@libs/base';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from '../../domain';

@Injectable()
export class ProductCommandRepository extends BaseCommandRepo<Product> {
  constructor(@InjectRepository(Product) private readonly commandRepository: Repository<Product>) {
    super(commandRepository);
  }
}
