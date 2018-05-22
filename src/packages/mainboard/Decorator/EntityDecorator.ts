import 'reflect-metadata'
import { AbstractcBaseEntity, IEntityConstructor } from '../BaseEntity'
/**
 *
 * @param name
 */
export function entity(name: string) {
  return function<T extends AbstractcBaseEntity>(cotr: IEntityConstructor<T>) {
    Reflect.defineMetadata('entityName', name, cotr)
    let entityName = Reflect.getMetadata('entityName', cotr)
    return cotr
  }
}
/**
 *
 * @param cotr
 */
export function field<T extends AbstractcBaseEntity>(
  cotr?: IEntityConstructor<T>
) {
  return function(target: object, propertyKey: string) {
    let keysMap: Map<any, any> =
      Reflect.getMetadata('propertyKey', target.constructor) ||
      new Map<any, any>()
    var t = Reflect.getMetadata('design:type', target, propertyKey)
    if (t.name == 'Number' || t.name == 'String' || t.name == 'Boolean') {
      keysMap.set(propertyKey, t)
    } else {
      if (cotr) {
        keysMap.set(propertyKey, cotr)
      } else {
        throw Error('Not specified object type')
      }
    }
    //console.log('keysMap:' + target.constructor, keysMap)
    Reflect.defineMetadata('propertyKey', keysMap, target.constructor)
  }
}
