import { ObjectLiteral } from '../BaseEntity'

export interface IQuery<T> {
  select(fields?: Array<string>): any
  getQuery(): any
  from(queryName?: string): any
  where(conditions: Partial<T> | ObjectLiteral): any
}
