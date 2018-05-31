import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient, ObservableQuery } from 'apollo-client'
import { HttpLink, createHttpLink } from 'apollo-link-http'
import {
  WatchQueryOptions,
  MutationOptions,
  SubscriptionOptions,
} from 'apollo-client'
import { ApolloLink, execute, makePromise, Observable } from 'apollo-link'
import gql from 'graphql-tag'
import { injectable, inject } from 'inversify'
import 'reflect-metadata'
import 'isomorphic-unfetch'
import { IDataProxy } from './IDataProxy'
import GraphQLMutationsAftewareLink from '../ServerDataProxy/GraphQLMutationsAftewareLink'

@injectable()
export class GraphQLDataProxy implements IDataProxy {
  private _client: ApolloClient<any>
  constructor(@inject('Url') url: string) {
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
    const httpLink = createHttpLink({
      uri: url,
      fetch: fetch,
    })
    //const link = new HttpLink({ uri: url })
    const afterwareLink = new GraphQLMutationsAftewareLink()
    this._client = new ApolloClient({
      link: middlewareLink.concat(afterwareLink).concat(httpLink),
      cache: new InMemoryCache(),
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
  public subscribe(
    options: SubscriptionOptions,
    oldQuery: string,
    callbackFun: any
  ) {
    return this._client.subscribe(options).subscribe(value => {
      if (value.data) {
        options.query
        const data = this._client.readQuery({
          query: gql`
            ${oldQuery}
          `,
        })
        this._client.writeQuery({
          query: gql`
            ${oldQuery}
          `,
          data: { ...data, value },
        })
        callbackFun(value)
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
