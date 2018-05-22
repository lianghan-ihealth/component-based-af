import { AbstractRepository } from './AbstractRepository'
import { GraphQLRespository } from './GraphQLRepository'
import { MemoryRepository } from './MemoryRepository'
import { AbstractcBaseEntity, IEntityConstructor } from '../BaseEntity'
import { IEntityManager } from '../EntityManager/IEntityManager'
import { IClientMessageProxy } from '../IClientMessageProxy'
import { IDataProxy } from '../ServerDataProxy/IDataProxy'
import { PContainer } from '../DIConfig/ioc.config'
import { TYPES } from '../DIConfig/types'

export class RepositoryFactory {
  public createMemoryRespository<T>(ctor: { new (): T }): MemoryRepository<T> {
    return new MemoryRepository<T>(
      PContainer.getNamed<IEntityManager<T>>(TYPES.IEntityManager, 'memory'),
      PContainer.get<IClientMessageProxy>(TYPES.IClientMessageProxy),
      ctor
    )
  }
  public createGraphQLRespository<T>(
    ctor: {
      new (): T
    }
    //componentname: string
  ): GraphQLRespository<T> {
    return new GraphQLRespository<T>(
      PContainer.getNamed<IDataProxy>(TYPES.IDataProxy, 'graphql'),
      PContainer.get<IClientMessageProxy>(TYPES.IClientMessageProxy),
      ctor
      ///componentname
    )
  }
}
