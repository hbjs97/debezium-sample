import { BaseQueryRepo } from '@libs/base';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, FindOneOptions, Repository } from 'typeorm';
import { Product } from '../../domain';

@Injectable()
export class ProductQueryRepository extends BaseQueryRepo<Product> {
  protected readonly entityName: string = Product.name;
  protected readonly relations: string[] = [];

  constructor(@InjectRepository(Product) private readonly productQueryRepository: Repository<Product>) {
    super(productQueryRepository);
  }

  async exists(condition: FindConditions<Product>, options?: FindOneOptions<Product>): Promise<boolean> {
    return !!(await this.repository.findOne(condition, options));
  }
}
