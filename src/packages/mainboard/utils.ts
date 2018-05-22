import 'reflect-metadata'
import { isMap } from 'lodash'

export function compareTopics(topic: string, existingTopic: string) {
  if (existingTopic.indexOf('#') === -1 && existingTopic.indexOf('*') === -1) {
    return topic === existingTopic
  }
  const pattern = topicToRegex(existingTopic)
  const rgx = new RegExp(pattern)
  const result = rgx.test(topic)
  return result
}
function topicToRegex(topic: string) {
  return `^${topic.split('.').reduce((result, segment, index, arr) => {
    let res = ''
    if (arr[index - 1]) {
      res = arr[index - 1] !== '#' ? '\\.\\b' : '\\b'
    }
    if (segment === '#') {
      res += '[\\s\\S]*'
    } else if (segment === '*') {
      res += '[^.]+'
    } else {
      res += segment
    }
    return result + res
  }, '')}`
}
export function createinstance<T>(ctor: { new (): T }) {
  return new ctor()
}

export function getEntityKeysMap(ctor: { new (): {} }) {
  let keysMap: Map<any, any> = new Map<any, any>()
  keysMap = Reflect.getMetadata('propertyKey', ctor)
  //console.log('++++++', ctor)
  //console.log('-------', Reflect.getMetadata('propertyKey', ctor))
  keysMap.forEach((value, key) => {
    //console.log('value: ', value)
    //console.log('key: ', key)
    if (!isPrimitive(value)) {
      //console.log('key is ', key)
      if (global.GlobalEntityMap && global.GlobalEntityMap.size != 0) {
        //console.log('global', global.GlobalEntityMap)
        if (global.GlobalEntityMap.get(key)) {
          keysMap.set(key, global.GlobalEntityMap.get(key))
        } else {
          //console.log('value: ', value)
          if (!isMap(value)) {
            let tmpMap = getEntityKeysMap(value)
            keysMap.set(key, tmpMap)
            global.GlobalEntityMap.set(key, tmpMap)
          }
        }
      } else {
        let tmpMap = getEntityKeysMap(value)
        global.GlobalEntityMap = new Map<string, Map<any, any>>()
        keysMap.set(key, tmpMap)
        global.GlobalEntityMap.set(key, tmpMap)
      }
    }
  })
  return keysMap
}
export function isPrimitive(obj: any) {
  switch (typeof obj) {
    case 'string':
    case 'number':
    case 'boolean':
      return true
  }
  return !!(
    obj instanceof String ||
    obj === String ||
    obj instanceof Number ||
    obj === Number ||
    obj instanceof Boolean ||
    obj === Boolean
  )
}
