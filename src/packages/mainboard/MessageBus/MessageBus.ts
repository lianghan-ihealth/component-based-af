import { OrderedMap } from 'immutable'
import { injectable } from 'inversify'
import 'reflect-metadata'
import { IMessage } from './IMessage'
import { IMessageBus } from './IMessageBus'
import { Message } from './Message'
import { Channel } from './Channel'
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs'
/**
 * message bus 类，用于组件间数据利用pub/sub传递
 */
@injectable()
export class MessageBus implements IMessageBus {
  private _channels: OrderedMap<string, Channel>
  private _trigger$ = new BehaviorSubject(1)
  private _defaultReply$ = Observable.of(new Message())
  constructor() {
    this._channels = OrderedMap<string, Channel>()
  }
  // public initChannel(channel: string = 'defaultChannel'): void {
  //   if (!this._channels.has(channel)) {
  //     this._channels = this._channels.set(channel, new Channel())
  //     this._trigger$.next()
  //   }
  // }
  public sub(channel: string, topic: string) {
    return this._trigger$.switchMap(() => {
      const c = this._channels.get(channel)
      return c ? c.from(topic) : this._defaultReply$
    })
  }
  public pub(channel: string, topic: string, message: IMessage) {
    if (!this._channels.has(channel)) {
      this._channels = this._channels.set(channel, new Channel())
      this._trigger$.next(1)
    }
    this._channels.get(channel).to(topic, message)
  }
}
