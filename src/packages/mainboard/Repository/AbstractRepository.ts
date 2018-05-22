import { AbstractcBaseEntity, IEntityConstructor } from '../BaseEntity'
import { IEntityManager } from '../EntityManager/IEntityManager'
import { IQueryBuilder } from '../QueryBuilder/IQueryBuilder'
import { FindOptions } from '../Repository/FindOptions'
/**
 *
 */
export abstract class AbstractRepository<T extends AbstractcBaseEntity> {
  abstract create(type: { new (): T }): T
  abstract findByIds(ids: string[], findOptions?: FindOptions): Promise<any>
  abstract find(conditions: Partial<T>, findOptions?: FindOptions): Promise<any>
  abstract updateById(
    id: string,
    partialEntity: Partial<T>,
    findOptions?: FindOptions
  ): Promise<any>
  abstract update(
    conditions: Partial<T>,
    partialEntity: Partial<T>,
    findOptions?: FindOptions
  ): Promise<any>
  abstract deleteById(id: string, findOptions?: FindOptions): Promise<any>
  abstract delete(
    conditions: Partial<T>,
    findOptions?: FindOptions
  ): Promise<any>
  abstract save(entities: T[], findOptions?: FindOptions): Promise<any>
  abstract clear(): void
  abstract execQuery(gql: string): Promise<any>
  abstract execUpdate(gql: string): Promise<any>
  abstract execInsert(gql: string): Promise<any>
  abstract execDelete(gql: string): Promise<any>
  abstract createQueryBuilder<T>(): IQueryBuilder<T>
}
