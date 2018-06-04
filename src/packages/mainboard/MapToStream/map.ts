import { map as mapRxjs } from 'rxjs/operators/map'

export function map(mapperFn) {
  return function(...args) {
    return mapRxjs(x => mapperFn(x, ...args))
  }
}
