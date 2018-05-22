import { isArray } from 'lodash'
import {
  AbstractcBaseEntity,
  IEntityConstructor,
  ObjectLiteral,
} from '../BaseEntity'
import { getEntityKeysMap, isPrimitive } from '../utils'
import { IQuery } from './IQuery'
export class Query<T extends AbstractcBaseEntity> implements IQuery<T> {
  protected readonly TWO_SPACE = '  '
  protected _queryName: string
  protected _entityKeysMap: Map<any, any>
  protected _EntityKeysMapForGraphql: Map<any, any>
  protected _where: string = ''

  constructor(ctor: IEntityConstructor<T>) {
    this._queryName = ctor.name
    //console.log(ctor)

    if (global.GlobalEntityMap && global.GlobalEntityMap.size != 0) {
      if (global.GlobalEntityMap.get(ctor.name)) {
        this._entityKeysMap = global.GlobalEntityMap.get(ctor.name)!
      } else {
        //console.log(ctor)
        this._entityKeysMap = getEntityKeysMap(ctor)
        global.GlobalEntityMap.set(ctor.name, this._entityKeysMap)
      }
    } else {
      this._entityKeysMap = getEntityKeysMap(ctor)
      global.GlobalEntityMap = new Map<string, Map<any, any>>()
      global.GlobalEntityMap.set(ctor.name, this._entityKeysMap)
    }
    this._EntityKeysMapForGraphql = new Map<any, any>()
  }

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
    } else {
      this._EntityKeysMapForGraphql = this._entityKeysMap
    }
    //console.log(this._EntityKeysMapForGraphql)
    return this
  }
  public getQuery() {
    if (this._EntityKeysMapForGraphql.size == 0) {
      this._EntityKeysMapForGraphql = this._entityKeysMap
    }
    //console.log(this._EntityKeysMapForGraphql)
    let graphql = `{`
    graphql = `${graphql}${this._mapToString(this._EntityKeysMapForGraphql)}`
    return `{${this.TWO_SPACE}${this._queryName}${this.TWO_SPACE}${
      this._where
    }${this.TWO_SPACE}${graphql}${this.TWO_SPACE}}${this.TWO_SPACE}}`
  }
  public from(queryName?: string) {
    if (queryName) {
      this._queryName = queryName
    }
    return this
  }
  public where(conditions: Partial<T> | ObjectLiteral) {
    let conditionsStr: string = this._formatConditonsObjectToString(conditions)
    this._where =
      '( ' + conditionsStr.substring(0, conditionsStr.length - 1) + ' )'
    return this
  }

  protected _formatConditonsObjectToString(conditions: ObjectLiteral) {
    let conditionsStr = ''
    //console.log(conditions)
    Object.keys(conditions).forEach(key => {
      if (isPrimitive(conditions[key])) {
        conditionsStr =
          conditionsStr + key + ': ' + JSON.stringify(conditions[key]) + ','
      } else if (isArray(conditions[key])) {
        conditionsStr =
          conditionsStr +
          '' +
          key +
          ': ' +
          JSON.stringify(conditions[key]) +
          ','
      } else {
        conditionsStr += this._formatConditonsObjectToString(conditions[key])
      }
    })
    return conditionsStr
  }
  protected _getSpecifyKeyOfDeepMap(strKeys: string, map: Map<any, any>): any {
    //console.log('strKeys: ', strKeys)
    if (strKeys.indexOf('.') != -1) {
      let specifyKey = strKeys.substring(0, strKeys.indexOf('.'))
      let leftoverKeys = strKeys.substring(strKeys.indexOf('.') + 1)
      let value = map.get(specifyKey)
      //console.log('value: ', value)
      return new Map<any, any>().set(
        specifyKey,
        this._getSpecifyKeyOfDeepMap(leftoverKeys, value)
      )
    } else {
      //console.log('key: ', strKeys)
      return new Map<any, any>().set(strKeys, map.get(strKeys))
    }
  }
  protected _mapToString(map: Map<any, any>): string {
    let str: string = ``
    map.forEach((value, key) => {
      if (value instanceof Map) {
        str = `${str}${this.TWO_SPACE}${this.TWO_SPACE}${key}${
          this.TWO_SPACE
        }{${this._mapToString(value)}${this.TWO_SPACE} }`
      } else {
        str = `${str}${this.TWO_SPACE}${key}`
      }
    })
    return str
  }
}
