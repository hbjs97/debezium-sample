import { BaseQueryRepo } from '@libs/base';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, FindOneOptions, Repository } from 'typeorm';
import { User } from '../../domain';

@Injectable()
export class UserQueryRepository extends BaseQueryRepo<User> {
  protected readonly entityName: string = User.name;
  protected readonly relations: string[] = [];

  constructor(@InjectRepository(User) private readonly userQueryRepository: Repository<User>) {
    super(userQueryRepository);
  }

  async exists(condition: FindConditions<User>, options?: FindOneOptions<User>): Promise<boolean> {
    return !!(await this.repository.findOne(condition, options));
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { email } });
  }
}
