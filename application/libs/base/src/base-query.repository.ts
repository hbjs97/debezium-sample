import { ArgumentInvalidException } from '@libs/exception';
import { Logger, NotFoundException } from '@nestjs/common';
import { compact, uniq } from 'lodash';
import { DeepPartial, FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import { BaseEntity } from './base.entity';

export interface IBaseFindOption {
  relations?: string[];
  required?: boolean;
  mainAlias?: string;
  withDeleted?: boolean;
}

export abstract class BaseQueryRepo<Entity extends BaseEntity> {
  protected abstract entityName: string;
  protected abstract relations: string[];
  protected MAX_RESULT_SIZE: number = 100;
  protected readonly logger: Logger;

  protected constructor(protected readonly repository: Repository<Entity>) {
    this.logger = new Logger(`${repository.metadata.name} query repository`);
  }

  async getOne(condition: FindOneOptions<Entity>): Promise<Entity> {
    return this.repository.findOneOrFail(condition).catch(() => {
      throw new NotFoundException('데이터를 찾을 수 없습니다.');
    });
  }

  async getMany(condition?: FindManyOptions<Entity>): Promise<Entity[]> {
    return this.repository.find(condition);
  }

  async getById(id: string, findOption?: IBaseFindOption): Promise<Entity> {
    const entity = await this.findById(id, findOption);
    if (!entity) throw new NotFoundException(`${this.entityName} 데이터를 찾을 수 없습니다.`);
    return entity;
  }

  async getByIds(ids: string[], findOption?: IBaseFindOption): Promise<Entity[]> {
    const entities = await this.findByIds(ids, findOption);

    if (entities.length !== ids.length) {
      throw new NotFoundException('다중 id 조회에 실패했습니다.');
    }
    return entities;
  }

  async find(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    return this.repository.find(options);
  }

  async findOne(options?: FindOneOptions<Entity>): Promise<Entity | undefined> {
    return this.repository.findOne(options);
  }

  async findByIds(ids: string[], findOption?: IBaseFindOption): Promise<Entity[]> {
    if (ids.length > this.MAX_RESULT_SIZE) throw new ArgumentInvalidException('조회 최대 개수를 초과했습니다.');
    /**
     * TODO:
     * 아래 커스텀 쿼리빌더 사용하는 부분 주석처리
     * @author 이제성
     */
    // const alias = findOption?.mainAlias || 'main';
    // return this.createQueryBuilder(findOption)
    //   .where(`${alias}.id IN (:ids)`, { ids: compact(union(ids)) })
    //   .getMany();
    return this.getMany({ ...findOption, where: { id: In(uniq(compact(ids))) } });
  }

  async findById(id: string | undefined, findOption?: IBaseFindOption): Promise<Entity | undefined> {
    if (!id) return undefined;
    const alias = findOption?.mainAlias || 'main';
    const qb = this.repository.createQueryBuilder(alias).where(`${alias}.id = :id`, { id });
    if (findOption?.relations) {
      findOption?.relations.forEach((v) => {
        const [property, relationAlias] = this.toJoinPropertyAndRelations(alias, v);
        findOption.required ? qb.innerJoinAndSelect(property, relationAlias) : qb.leftJoinAndSelect(property, relationAlias);
      });
    } else {
      this.relations.forEach((v) => {
        const [property, relationAlias] = this.toJoinPropertyAndRelations(alias, v);
        qb.leftJoinAndSelect(property, relationAlias);
      });
    }
    if (findOption?.withDeleted) qb.withDeleted();
    const entity = await qb.getOne();
    return entity;
  }

  /**
   * TODO:
   * 고도화 할 수 있을 듯
   * @author 이제성
   */
  // private createQueryBuilder(findOption?: IBaseFindOption): SelectQueryBuilder<Entity> {
  //   const alias = findOption?.mainAlias || 'main';
  //   const qb = this.repository.createQueryBuilder(alias);
  //   if (findOption?.relations) {
  //     findOption?.relations.forEach((v) => {
  //       const [property, relationAlias] = this.toJoinPropertyAndRelations(alias, v);
  //       findOption.required ? qb.innerJoinAndSelect(property, relationAlias) : qb.leftJoinAndSelect(property, relationAlias);
  //     });
  //   } else {
  //     this.relations.forEach((v) => {
  //       const [property, relationAlias] = this.toJoinPropertyAndRelations(alias, v);
  //       qb.leftJoinAndSelect(property, relationAlias);
  //     });
  //   }
  //   if (findOption?.withDeleted) qb.withDeleted();
  //   return qb;
  // }

  private toJoinPropertyAndRelations(alias: string, relation: string): [string, string] {
    const aliasEntities = relation.split('.');
    const property = aliasEntities.length > 1 ? relation : `${alias}.${relation}`;
    const relationAlias = aliasEntities[aliasEntities.length - 1];
    return [property, relationAlias];
  }
}
