import { Container, interfaces } from 'inversify'
import { TYPES } from './types'
import { IClientMessageProxy } from '../IClientMessageProxy'
import { ClientMessageProxy } from '../ClientMessageProxy'
import { IEntityManager } from '../EntityManager/IEntityManager'
import { MemoryEntityManager } from '../EntityManager/MemoryEntityManager'
import { IMessage } from '../MessageBus/IMessage'
import { Message } from '../MessageBus/Message'
import { IMessageBus } from '../MessageBus/IMessageBus'
import { MessageBus } from '../MessageBus/MessageBus'
import { AbstractRepository } from '../Repository/AbstractRepository'
import { MemoryRepository } from '../Repository/MemoryRepository'
import { IQueryBuilder } from '../QueryBuilder/IQueryBuilder'
import { GraphQLQueryBuilder } from '../QueryBuilder/GraphQLQueryBuilder'
import { AbstractcBaseEntity, IEntityConstructor } from '../BaseEntity'
import { IDataProxy } from '../ServerDataProxy/IDataProxy'
import { GraphQLDataProxy } from '../ServerDataProxy/GraphQLDataProxy'

const PContainer = new Container()

PContainer.bind<IMessage>(TYPES.IMessage).to(Message)

PContainer.bind<IMessageBus>(TYPES.IMessageBus)
  .to(MessageBus)
  .inSingletonScope()

PContainer.bind<IClientMessageProxy>(TYPES.IClientMessageProxy).to(
  ClientMessageProxy
)

PContainer.bind<IEntityManager<any>>(TYPES.IEntityManager)
  .to(MemoryEntityManager)
  .inSingletonScope()
  .whenTargetNamed('memory')

PContainer.bind<IDataProxy>(TYPES.IDataProxy)
  .to(GraphQLDataProxy)
  .inSingletonScope()
  .whenTargetNamed('graphql')

PContainer.bind<string>('Url')
  .toConstantValue('http://localhost:3081/graphql')
  .whenInjectedInto(GraphQLDataProxy)
PContainer.bind<string>('WsUrl')
  .toConstantValue('ws://localhost:3081/feedback')
  .whenInjectedInto(GraphQLDataProxy)
//PContainer.bind<AbstractRepository<any>>(TYPES.AbstractRepository).to(MemoryRepository);

//PContainer.bind<IQueryBuilder>(TYPES.IQueryBuilder).to(GraphQLQueryBuilder)
export { PContainer }
