import { of } from 'rxjs/observable/of'
import { map } from 'rxjs/operators/map'
import { cloneDeep } from 'lodash'
import { switchMap } from 'rxjs/operators/switchMap'
import { Observable } from 'rxjs/observable'
import { IMessage } from '../MessageBus/IMessage'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { ClientMessageProxy } from '.././ClientMessageProxy'
import { PContainer } from '../DIConfig/ioc.config'
import { TYPES } from '../DIConfig/types'
import { IMessageBus } from '../MessageBus/IMessageBus'

export function withMessageBus(channel: string, topic: string, ...mappers) {
  return function() {
    const message$ = new BehaviorSubject(null)
    const messageBus = PContainer.get<IMessageBus>(TYPES.IMessageBus)
    let messageBusProxy = new ClientMessageProxy(messageBus)
    const source = messageBusProxy.sub(channel, topic).pipe(
      map(value => {
        if (value) {
          //console.log('value', value)
          let result = cloneDeep(value)
          if (result) {
            mappers.forEach(func => {
              result.Data = func!(result.Data)
            })
          }
          return result
        }
      }),
      map(v => ({ [topic]: v.Data })),
      map(v => {
        if (v[topic]) {
          return v
        }
      })
    )
    return source
  }
}
