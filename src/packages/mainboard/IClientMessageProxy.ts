import { Observable } from 'rxjs/Observable'
import { IMessage } from './MessageBus/IMessage'

/**
 * message bus proxy 提供扩展方法registerMethod，预处理消息数据
 */
export interface IClientMessageProxy {
  // initChannel(channel: string):void;
  sub(channel: string, topic: string): Observable<IMessage>
  pub(channel: string, topic: string, message: IMessage): void
  registerMethod<T>(methodName: string, method: (data: T[]) => T[]): void
  unregisterMethod(methodName: string): void
}
