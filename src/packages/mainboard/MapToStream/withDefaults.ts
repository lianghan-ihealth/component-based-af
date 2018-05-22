import { of } from 'rxjs/observable/of'

export function withDefaults(def: any) {
  return function(...args) {
    const defaultsObj = typeof def === 'function' ? def(...args) : def

    const result$ = of(defaultsObj)
    return result$
  }
}
