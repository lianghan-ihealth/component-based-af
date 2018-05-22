import {
  ApolloLink,
  Operation,
  NextLink,
  FetchResult,
  Observable,
} from 'apollo-link'
import { set, get } from 'lodash'

export default class GraphQLMutationsAftewareLink extends ApolloLink {
  constructor() {
    super()
  }

  public request(
    operation: Operation,
    forward: NextLink
  ): Observable<FetchResult> {
    return new Observable<FetchResult>(observer => {
      const subscription = forward(operation).subscribe({
        next: result => {
          const context = operation.getContext()
          const {
            response: { headers },
          } = context
          set(
            result,
            'refetchQueryList',
            get(headers, '_headers.refetch-query-list')
            //headers._headers['refetch-query-list'] || ''
          )
          observer.next(result)
        },
        error: error => {
          observer.error(error)
        },
        complete: observer.complete.bind(observer),
      })
      return () => {
        if (subscription) subscription.unsubscribe()
      }
    })
  }
}
