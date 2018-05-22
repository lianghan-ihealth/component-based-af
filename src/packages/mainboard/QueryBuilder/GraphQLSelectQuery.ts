import 'reflect-metadata'
import { isArray } from 'lodash'
import { Query } from './Query'
import {
  AbstractcBaseEntity,
  IEntityConstructor,
  ObjectLiteral,
} from '../BaseEntity'
import { getEntityKeysMap, isPrimitive } from '../utils'
export class GraphQLSelectQuery<T extends AbstractcBaseEntity> extends Query<
  T
> {}
