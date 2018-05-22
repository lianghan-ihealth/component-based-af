import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators/map'
import { Map } from 'immutable'
import { injectable, inject } from 'inversify'
import 'reflect-metadata'
import { IClientMessageProxy } from './IClientMessageProxy'
import { IMessageBus } from './MessageBus/IMessageBus'
import { IMessage } from './MessageBus/IMessage'
import { TYPES } from './DIConfig/types'
import { switchMap } from 'rxjs/operators'

@injectable()
export class ClientMessageProxy implements IClientMessageProxy {
  private _methods: Map<string, Function>
  private _messageBus: IMessageBus
  //private _listenedlst:Set<OrderedMap<string,string>>

  //Singleton messagebus
  constructor(@inject(TYPES.IMessageBus) messageBus: IMessageBus) {
    this._methods = Map<string, Function>()
    this._messageBus = messageBus
  }
  // public initChannel(channel: string = 'defaultChannel') {
  //   this._messageBus.initChannel(channel)
  // }
  public sub(channel: string, topic: string): Observable<IMessage> {
    return this._messageBus
      .sub(channel, topic)
      .pipe(map(value => this._handleMessages(channel, topic, value)))
  }
  public pub(channel: string, topic: string, message: IMessage) {
    this._messageBus.pub(channel, topic, message)
  }

  public registerMethod<T>(methodName: string, method: (data: T) => T) {
    this._methods = this._methods.set(methodName, (data: T) => {
      return method(data)
    })
  }
  public unregisterMethod(methodName: string) {
    this._methods = this._methods.delete(methodName)
  }
  private _handleMessages(
    channle: string,
    topic: string,
    message: IMessage
  ): IMessage {
    let result = message.Data
    // console.log("message data:" , result);
    if (result) {
      const handles = this._methods.forEach(func => {
        result = func!(result)
        //console.log(func)
      })
    }
    return { ...message, Data: result }
  }
}
