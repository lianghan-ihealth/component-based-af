import { Observable } from 'rxjs/Observable'
import { injectable } from 'inversify'
import 'reflect-metadata'
import { IMessage } from './IMessage'

/**
 * message bus interface
 */
export interface IMessageBus {
  // initChannel(channel: string): void;
  //sub(channel: string,topic: string): Observable<T|T[]>
  sub(channel: string, topic: string): Observable<IMessage>
  pub(channel: string, topic: string, message: IMessage): void
}
