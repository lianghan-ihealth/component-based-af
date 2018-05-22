import { injectable, inject, interfaces } from 'inversify'
import 'reflect-metadata'
import { IQueryBuilder } from './IQueryBuilder'
import { IEntityConstructor, AbstractcBaseEntity } from '../BaseEntity'
import { createinstance } from '../utils'
import { TYPES } from '../DIConfig/types'
import { IQuery } from './IQuery'
import { GraphQLSelectQuery } from './GraphQLSelectQuery'
import { GraphQLMutationQuery } from './GraphQLMutationQuery'

@injectable()
export class GraphQLQueryBuilder<T extends AbstractcBaseEntity>
  implements IQueryBuilder<T> {
  private _ctor: IEntityConstructor<T>

  constructor(ctor: IEntityConstructor<T>) {
    this._ctor = ctor
  }
  public selectQuery<T>(ctor: IEntityConstructor<T>): IQuery<T> {
    return new GraphQLSelectQuery<T>(ctor)
  }
  public updateQuery<T>(ctor: IEntityConstructor<T>): IQuery<T> {
    return new GraphQLMutationQuery<T>(ctor)
  }
  public deleteQuery(ctor: IEntityConstructor<T>): IQuery<T> {
    return new GraphQLMutationQuery<T>(ctor)
  }
  public insertQuery(ctor: IEntityConstructor<T>): IQuery<T> {
    return new GraphQLMutationQuery<T>(ctor)
  }
}
