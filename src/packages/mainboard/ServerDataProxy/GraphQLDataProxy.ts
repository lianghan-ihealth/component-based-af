import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { ApolloClient, ObservableQuery } from 'apollo-client'
import { HttpLink, createHttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import {
  WatchQueryOptions,
  MutationOptions,
  SubscriptionOptions,
} from 'apollo-client'
import {
  ApolloLink,
  execute,
  makePromise,
  Observable,
  split,
} from 'apollo-link'
import gql from 'graphql-tag'
import { injectable, inject } from 'inversify'
import 'reflect-metadata'
import 'isomorphic-unfetch'
import { IDataProxy } from './IDataProxy'
import GraphQLMutationsAftewareLink from '../ServerDataProxy/GraphQLMutationsAftewareLink'

interface Definintion {
  kind: string
  operation?: string
}
@injectable()
export class GraphQLDataProxy implements IDataProxy {
  private _client: ApolloClient<any>
  constructor(@inject('Url') url: string, @inject('WsUrl') wsUrl: string) {
    const middlewareLink = new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: {
          'client-codename': 'TEST',
          'Access-Control-Allow-Origin': '*',
          authorization:
            'Bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVHlwZSI6IkhFQUxUSF9DQVJFX1BST0ZFU1NJT05BTCIsInVzZXJJZCI6ImhjcDEiLCJpYXQiOjE1MDQ2ODE0NDEsImV4cCI6MzA4MjU2MTQ0MX0.JLCnNEz1gvOuuSUflazmPFZWu7Bq_0EzenP3huc5bqY',
        },
      })
      return forward ? forward(operation) : null
    })
    const wsLink = new WebSocketLink({
      uri: wsUrl,
      options: {
        reconnect: true,
      },
    })
    const httpLink = createHttpLink({
      uri: url,
      fetch: fetch,
    })
    const afterwareLink = new GraphQLMutationsAftewareLink().concat(httpLink)
    const link = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation }: Definintion = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
      },
      wsLink,
      afterwareLink
    )
    const fragmentMatcher = new IntrospectionFragmentMatcher({
      introspectionQueryResultData: {
        __schema: {
          types: [
            {
              kind: 'INTERFACE',
              name: 'ChatMessage',
              possibleTypes: [
                { name: 'AudioMessage' },
                { name: 'TextMessage' },
                { name: 'ImageMessage' },
              ],
            },
          ],
        },
      },
    })
    //const link = new HttpLink({ uri: url })
    this._client = new ApolloClient({
      link: middlewareLink.concat(link),
      cache: new InMemoryCache({ fragmentMatcher: fragmentMatcher }),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
          errorPolicy: 'ignore',
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
        mutate: {
          errorPolicy: 'all',
        },
      },
    })
  }
  public query(options: WatchQueryOptions): Promise<any> {
    if (!global.ActiveQueryMap) {
      global.ActiveQueryMap = new Map<string, Set<any>>()
    }
    let currentQuery = global.ActiveQueryMap.get(options.context.queryTypeName)
    if (currentQuery) {
      if (!currentQuery.has(options.query)) {
        currentQuery.add(options.query)
      }
    } else {
      global.ActiveQueryMap.set(
        options.context.queryTypeName,
        new Set().add(options.query)
      )
    }
    //console.log('ActiveQueryMap: ', global.ActiveQueryMap)
    this._client.watchQuery<any>(options).subscribe(value => {
      if (value.data) {
        //console.log('777777777', value.data)
        options.context.callbackFun(options.context, value.data)
      }
    })
    return this._client.query(options)
  }
  public update(options: MutationOptions): Promise<any> {
    return this._mutationOperate(options)
  }
  public delete(options: MutationOptions): Promise<any> {
    return this._mutationOperate(options)
  }
  public insert(options: MutationOptions): Promise<any> {
    return this._mutationOperate(options)
  }
  public subscribe(options: SubscriptionOptions, callbackFun: any) {
    return this._client.subscribe(options).subscribe(value => {
      if (value.data) {
        //console.log('value', value)
        callbackFun(value.data)
      }
    })
  }
  private _mutationOperate(options: MutationOptions) {
    options.update = (proxy, fetchResult) => {
      const refetchQueryList = fetchResult['refetchQueryList']
      if (refetchQueryList) {
        for (let queryName of refetchQueryList.toString().split(',')) {
          for (let activeQuery of global.ActiveQueryMap.get(queryName)) {
            this._client.query({ query: activeQuery }) //删除等数据要返回，利用proxy清理cache
          }
        }
      }
    }
    return this._client.mutate(options)
  }
}
