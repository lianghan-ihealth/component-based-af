import { DocumentNode } from 'graphql'
export {}
declare global {
  interface Window {
    GlobalEntityMap: Map<string, Map<any, any>>
    ActiveQueryMap: Map<string, Set<DocumentNode>>
  }
  namespace NodeJS {
    interface Global {
      GlobalEntityMap: Map<string, Map<any, any>>
      ActiveQueryMap: Map<string, Set<DocumentNode>>
    }
  }
}
