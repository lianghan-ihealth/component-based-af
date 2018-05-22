import { Query } from './Query'
import {
  AbstractcBaseEntity,
  IEntityConstructor,
  ObjectLiteral,
} from '../BaseEntity'
export class GraphQLMutationQuery<T extends AbstractcBaseEntity> extends Query<
  T
> {
  public select(fields?: Array<string>) {
    if (fields) {
      fields.forEach(field => {
        if (field.indexOf('.') != -1) {
          let key = field.substring(0, field.indexOf('.'))
          let leftoverKeys = field.substring(field.indexOf('.') + 1)
          let entityKeysSubMap = this._entityKeysMap.get(key)
          this._EntityKeysMapForGraphql.set(
            key,
            this._getSpecifyKeyOfDeepMap(leftoverKeys, entityKeysSubMap)
          )
        } else {
          if (this._entityKeysMap.has(field)) {
            this._EntityKeysMapForGraphql.set(
              field,
              this._entityKeysMap.get(field)
            )
          }
        }
      })
    }
    return this
  }
  public getQuery() {
    let graphql = ``
    let end_graphql = `${this.TWO_SPACE}}`
    if (this._EntityKeysMapForGraphql.size != 0) {
      graphql = `{`
      end_graphql = `${this.TWO_SPACE}}${this.TWO_SPACE}}`
    }
    graphql = `${graphql}${this._mapToString(this._EntityKeysMapForGraphql)}`
    return `{${this.TWO_SPACE}${this._queryName}${this.TWO_SPACE}${
      this._where
    }${this.TWO_SPACE}${graphql}${end_graphql}`
  }
}
