import { InternalServerErrorException, Logger } from '@nestjs/common';
import { compact } from 'lodash';
import { DeepPartial, FindConditions, Repository, SaveOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';
import { BaseEntity } from './base.entity';

export abstract class BaseCommandRepo<Entity extends BaseEntity> {
  protected readonly logger: Logger;
  protected constructor(protected readonly repository: Repository<Entity>) {
    this.logger = new Logger(`${repository.metadata.name} command repository`);
  }

  async save<T extends DeepPartial<Entity>>(entity: T, options?: SaveOptions): Promise<T> {
    try {
      const savedEntity = await this.repository.save(entity, { ...options, reload: options?.reload ?? true });
      return savedEntity;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('데이터 저장을 실패했습니다.');
    }
  }

  async saveMultiple<T extends DeepPartial<Entity>>(entities: Optional<T>[], options?: SaveOptions): Promise<T[]> {
    return this.repository.save(compact(entities), { ...options, reload: options?.reload ?? true });
  }

  async update(condition: FindConditions<Entity>, partialEntity: QueryDeepPartialEntity<Entity>): Promise<Entity[]> {
    const updateResult = await this.repository.update(condition, partialEntity);
    return this.repository.find(condition);
  }

  async softDelete(condition: FindConditions<Entity>): Promise<void> {
    const updateResult = await this.repository.update(condition, { deletedAt: () => 'CURRENT_TIMESTAMP(6)' });
    // TODO: unlink entities from redis using updateResult
  }

  async softDeleteById(id: number | string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .where('id = :id', { id })
      .update({ deletedAt: () => 'CURRENT_TIMESTAMP(6)' })
      .execute();
  }

  async upsert(
    entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[],
    conflictPathsOrOptions: string[] | UpsertOptions<Entity>,
  ): Promise<void> {
    const insertResult = await this.repository.upsert(entity, conflictPathsOrOptions);
    // TODO: unlink entities from redis using insertResult
  }
}
