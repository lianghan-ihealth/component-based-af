import { injectable, inject } from 'inversify'
import 'reflect-metadata'
import { values, merge } from 'lodash'
import gql from 'graphql-tag'
import { AbstractRepository } from './AbstractRepository'
import { AbstractcBaseEntity, IEntityConstructor } from '../BaseEntity'
import { IEntityManager } from '../EntityManager/IEntityManager'
import { IClientMessageProxy } from '../IClientMessageProxy'
import { IDataProxy } from '../ServerDataProxy/IDataProxy'
import { IQueryBuilder } from '../QueryBuilder/IQueryBuilder'
import { GraphQLQueryBuilder } from '../QueryBuilder/GraphQLQueryBuilder'
import { FindOptions } from './FindOptions'
import ChannelAndTopicWithQueryMap from './ChannelAndTopicWithQueryMap'
import { Message } from '../MessageBus/Message'
import { DataType } from '../MessageBus/IMessage'

export class GraphQLRespository<T extends AbstractcBaseEntity>
  implements AbstractRepository<T> {
  private _messagproxy: IClientMessageProxy
  private _dataproxy: IDataProxy
  private _channel: string
  private _graphql: string = ''
  //private _graphql: string
  private _entity_ctor: IEntityConstructor<T>
  private _regxQuery = new RegExp(
    '\\s*(query|mutation)\\s+([a-zA-Z][\\w\\d]*)\\s*{\\s*([a-zA-Z][\\w\\d]*)'
  )
  //private _regxFrom = new RegExp('(\\s*(query|mutation)\\s+)([a-zA-Z][\\w\\d]*)\\s*{\\s*([a-zA-Z][\\w\\d]*)')
  constructor(
    dataproxy: IDataProxy,
    messageproxy: IClientMessageProxy,
    ctor: IEntityConstructor<T>
    //componentname: string
  ) {
    this._dataproxy = dataproxy
    this._messagproxy = messageproxy
    this._channel = ctor.name
    this._entity_ctor = ctor
    //this._entityname = ctor.name;
    //this._graphql = getGraphQLTemplete(ctor)
  }
  create(type: { new (): T }): T {
    type key = (keyof T)[]
    return new type()
  }
  findByIds(ids: string[], findOptions?: FindOptions): Promise<any> {
    //可以约定可以针对一个实体query名称与实体名称一致
    let grqlbuilder = new GraphQLQueryBuilder(this._entity_ctor)
    let query = grqlbuilder.selectQuery(this._entity_ctor).where({ ids: ids })
    let queryName = this._entity_ctor.name
    let from = this._entity_ctor.name
    if (findOptions) {
      if (findOptions.select) {
        query = query.select(findOptions.select)
      }
      if (findOptions.from) {
        query = query.from(findOptions.from)
        from = findOptions.from
      }
      if (findOptions.queryName) {
        queryName = findOptions.queryName
      }
    }
    //console.log(`query ${queryName} ${query.getQuery()}`)
    return this.execQuery(`query ${queryName} ${query.getQuery()}`)
  }
  find(conditions: Partial<T>, findOptions?: FindOptions): Promise<any> {
    let grqlbuilder = new GraphQLQueryBuilder(this._entity_ctor)
    let query = grqlbuilder.selectQuery(this._entity_ctor).where(conditions)
    let queryName = this._entity_ctor.name
    let from = this._entity_ctor.name
    if (findOptions) {
      if (findOptions.select) {
        query = query.select(findOptions.select)
      }
      if (findOptions.from) {
        query = query.from(findOptions.from)
        from = findOptions.from
      }
      if (findOptions.queryName) {
        queryName = findOptions.queryName
      }
    }
    //console.log(`query ${queryName} ${query.getQuery()}`)
    return this.execQuery(`query ${queryName} ${query.getQuery()}`)
  }
  updateById(
    id: string,
    partialEntity: Partial<T>,
    findOptions?: FindOptions
  ): Promise<any> {
    Object.defineProperty(partialEntity, 'id', {
      value: id,
      writable: true,
      enumerable: true,
      configurable: true,
    })
    let grqlbuilder = new GraphQLQueryBuilder(this._entity_ctor)
    let query = grqlbuilder.updateQuery(this._entity_ctor).where(partialEntity)
    let queryName = this._entity_ctor.name
    let from = this._entity_ctor.name
    if (findOptions) {
      if (findOptions.select) {
        query = query.select(findOptions.select)
      }
      if (findOptions.from) {
        query = query.from(findOptions.from)
        from = findOptions.from
      }
      if (findOptions.queryName) {
        queryName = findOptions.queryName
      }
    }
    //console.log(`mutation ${queryName} ${query.getQuery()}`)
    return this.execUpdate(`mutation ${queryName} ${query.getQuery()}`)
  }
  update(
    conditions: Partial<T>,
    partialEntity: Partial<T>,
    findOptions?: FindOptions
  ): Promise<any> {
    let grqlbuilder = new GraphQLQueryBuilder(this._entity_ctor)
    let query = grqlbuilder
      .updateQuery(this._entity_ctor)
      .where(merge(conditions, partialEntity))
    let queryName = this._entity_ctor.name
    let from = this._entity_ctor.name
    if (findOptions) {
      if (findOptions.select) {
        query = query.select(findOptions.select)
      }
      if (findOptions.from) {
        query = query.from(findOptions.from)
        from = findOptions.from
      }
      if (findOptions.queryName) {
        queryName = findOptions.queryName
      }
    }
    //console.log(`mutation ${queryName} ${query.getQuery()}`)
    return this.execUpdate(`mutation ${queryName} ${query.getQuery()}`)
  }
  deleteById(id: string, findOptions?: FindOptions): Promise<any> {
    let grqlbuilder = new GraphQLQueryBuilder(this._entity_ctor)
    let query = grqlbuilder.deleteQuery(this._entity_ctor).where({ id: id })
    let queryName = this._entity_ctor.name
    let from = this._entity_ctor.name
    if (findOptions) {
      if (findOptions.select) {
        query = query.select(findOptions.select)
      }
      if (findOptions.from) {
        query = query.from(findOptions.from)
        from = findOptions.from
      }
      if (findOptions.queryName) {
        queryName = findOptions.queryName
      }
    }
    //console.log(`mutation ${queryName} ${query.getQuery()}`)
    return this.execDelete(`mutation ${queryName} ${query.getQuery()}`)
  }
  delete(conditions: Partial<T>, findOptions?: FindOptions): Promise<any> {
    let grqlbuilder = new GraphQLQueryBuilder(this._entity_ctor)
    let query = grqlbuilder.deleteQuery(this._entity_ctor).where(conditions)
    let queryName = this._entity_ctor.name
    let from = this._entity_ctor.name
    if (findOptions) {
      if (findOptions.select) {
        query = query.select(findOptions.select)
      }
      if (findOptions.from) {
        query = query.from(findOptions.from)
        from = findOptions.from
      }
      if (findOptions.queryName) {
        queryName = findOptions.queryName
      }
    }
    //console.log(`mutation ${queryName} ${query.getQuery()}`)
    return this.execDelete(`mutation ${queryName} ${query.getQuery()}`)
  }
  save(entities: T[], findOptions?: FindOptions): Promise<any> {
    let grqlbuilder = new GraphQLQueryBuilder(this._entity_ctor)
    let query = grqlbuilder
      .insertQuery(this._entity_ctor)
      .where({ entities: entities })
    let queryName = this._entity_ctor.name
    let from = this._entity_ctor.name
    if (findOptions) {
      if (findOptions.from) {
        query = query.from(findOptions.from)
        from = findOptions.from
      }
      if (findOptions.queryName) {
        queryName = findOptions.queryName
      }
    }
    //console.log(`mutation ${queryName} ${query.getQuery()}`)
    return this.execInsert(`mutation ${queryName} ${query.getQuery()}`)
  }
  public execQuery(gqlQuery: string) {
    const queryAliasName = gqlQuery.match(this._regxQuery)[2]
    const from = gqlQuery.match(this._regxQuery)[3]
    // console.log('query:', gqlQuery)
    // console.log('queryAliasName:', queryAliasName)
    // console.log('from:', from)
    return this._dataproxy.query({
      query: gql`
        ${gqlQuery}
      `,
      context: {
        channel: this._channel,
        topic: queryAliasName,
        //queryName: queryAliasName,
        queryTypeName: from,
        //pub 数据
        callbackFun: (context: ChannelAndTopicWithQueryMap, data: any) => {
          let message = new Message()
          message.Data = data
          message.MessageType = DataType.Entity
          this._messagproxy.pub(context.channel, context.topic, message)
        },
      },
    })
  }
  public execUpdate(gqlQuery: string) {
    // gqlQuery =
    //   'mutation sendTextChatMessage { sendTextChatMessage (chatRoomId:"chatRoom1",text:"23456789"){ text _id}}'
    const queryAliasName = gqlQuery.match(this._regxQuery)[2]
    const from = gqlQuery.match(this._regxQuery)[3]
    return this._dataproxy.update({
      mutation: gql`
        ${gqlQuery}
      `,
      context: {
        channel: this._channel,
        topic: queryAliasName,
        //queryName: queryAliasName,
        queryTypeName: from,
      },
    })
  }
  public execInsert(gqlQuery: string) {
    const queryAliasName = gqlQuery.match(this._regxQuery)[2]
    const from = gqlQuery.match(this._regxQuery)[3]
    return this._dataproxy.insert({
      mutation: gql`
        ${gqlQuery}
      `,
      context: {
        channel: this._channel,
        topic: queryAliasName,
        //queryName: queryAliasName,
        queryTypeName: from,
      },
    })
  }
  public execDelete(gqlQuery: string) {
    const queryAliasName = gqlQuery.match(this._regxQuery)[2]
    const from = gqlQuery.match(this._regxQuery)[3]
    return this._dataproxy.delete({
      mutation: gql`
        ${gqlQuery}
      `,
      context: {
        channel: this._channel,
        topic: queryAliasName,
        //queryName: queryAliasName,
        queryTypeName: from,
      },
    })
  }
  clear(): void {
    throw Error('clear is not implemented')
  }
  createQueryBuilder<T>(): IQueryBuilder<T> {
    throw Error('update is not implemented')
  }
}
