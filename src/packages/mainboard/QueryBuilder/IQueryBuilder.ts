import { IEntityConstructor, AbstractcBaseEntity } from '../BaseEntity'
import { IQuery } from './IQuery'

export interface IQueryBuilder<T extends AbstractcBaseEntity> {
  selectQuery<T extends AbstractcBaseEntity>(
    ctor: IEntityConstructor<T>
  ): IQuery<T>
  updateQuery(ctor: IEntityConstructor<T>): IQuery<T>
  deleteQuery(ctor: IEntityConstructor<T>): IQuery<T>
  insertQuery(ctor: IEntityConstructor<T>): IQuery<T>
}
