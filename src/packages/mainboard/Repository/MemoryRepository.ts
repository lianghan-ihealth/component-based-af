import { injectable, inject } from 'inversify'
import 'reflect-metadata'
import { AbstractRepository } from './AbstractRepository'
import { FindOptions } from './FindOptions'
import { AbstractcBaseEntity, IEntityConstructor } from '../BaseEntity'
import { IEntityManager } from '../EntityManager/IEntityManager'
import { IClientMessageProxy } from '../IClientMessageProxy'
import { IQueryBuilder } from '../QueryBuilder/IQueryBuilder'
import { Message } from '../MessageBus/Message'
import { DataType } from '../MessageBus/IMessage'
import { TYPES } from '../DIConfig/types'
/**
 * Repository 用于更新,查找,删除,实体数据池里的实体对象,并对拉平后实体重新进行pub
 */

export class MemoryRepository<
  T extends AbstractcBaseEntity
> extends AbstractRepository<T> {
  private _manager: IEntityManager<T>
  private _messagproxy: IClientMessageProxy
  private _channel: string
  //Singleton entityManager
  constructor(
    manager: IEntityManager<T>,
    messageproxy: IClientMessageProxy,
    ctor: { new (): T }
  ) {
    super()
    this._manager = manager
    this._messagproxy = messageproxy
    this._channel = ctor.name
  }

  public create(type: IEntityConstructor<T>): T {
    return new type()
  }
  public findByIds(ids: string[], findOptions?: FindOptions): Promise<T[]> {
    if (!ids.length) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }
    let message = new Message()
    message.Data = this._manager.Entities
    message.MessageType = DataType.Entity
    this._messagproxy.pub(this._channel, '*', message)
    return new Promise(resolve => {
      resolve(this._manager.findByIds(ids))
    })
  }
  public find(conditions: Partial<T>): Promise<T[]> {
    let message = new Message()
    message.Data = this._manager.Entities
    message.MessageType = DataType.Entity
    this._messagproxy.pub(this._channel, '*', message)
    return new Promise(resolve => resolve(this._manager.find(conditions)))
  }
  public updateById(id: string, partialEntity: Partial<T>): Promise<T> {
    let message = new Message()
    message.Data = this._manager.Entities
    message.MessageType = DataType.Entity
    this._messagproxy.pub(this._channel, '*', message)
    return new Promise(resolve =>
      resolve(this._manager.updateById(id, partialEntity))
    )
  }
  public update(
    conditions: Partial<T>,
    partialEntity: Partial<T>
  ): Promise<T[]> {
    let message = new Message()
    message.Data = this._manager.Entities
    message.MessageType = DataType.Entity
    this._messagproxy.pub(this._channel, '*', message)
    return new Promise(resolve =>
      resolve(this._manager.update(conditions, partialEntity))
    )
  }
  public deleteById(id: string): Promise<T> {
    let message = new Message()
    message.Data = this._manager.Entities
    message.MessageType = DataType.Entity
    this._messagproxy.pub(this._channel, '*', message)
    return new Promise(resolve => resolve(this._manager.deleteById(id)))
  }
  public delete(conditions: Partial<T>): Promise<T[]> {
    let message = new Message()
    message.Data = this._manager.Entities
    message.MessageType = DataType.Entity
    this._messagproxy.pub(this._channel, '*', message)
    return new Promise(resolve => resolve(this._manager.delete(conditions)))
  }
  public save(entities: T[]): Promise<T[]> {
    let message = new Message()
    message.Data = this._manager.Entities
    message.MessageType = DataType.Entity
    this._messagproxy.pub(this._channel, '*', message)
    this._manager.save(entities)
    return new Promise(resolve => resolve(this._manager.Entities))
  }
  public clear(): void {
    let message = new Message()
    this._manager.clear()
    message.Data = this._manager.Entities
    message.MessageType = DataType.Entity
    this._messagproxy.pub(this._channel, '*', message)
  }
  public createQueryBuilder<T>(): IQueryBuilder<T> {
    console.error('createQueryBuilder is not implemented')
    throw Error('createQueryBuilder is not implemented')
  }
  public execQuery(gql: string): Promise<any> {
    throw Error('execQuery is not implemented')
  }
  public execUpdate(gql: string): Promise<any> {
    throw Error('execUpdate is not implemented')
  }
  public execInsert(gql: string): Promise<any> {
    throw Error('execInsert is not implemented')
  }
  public execDelete(gql: string): Promise<any> {
    throw Error('execDelete is not implemented')
  }
  public execsubscribe(gql: string): Promise<any> {
    throw Error('execsubscribe is not implemented')
  }
  public subscribe(conditions: Partial<T>, findOptions?: FindOptions) {
    throw Error('subscribe is not implemented')
  }
}
