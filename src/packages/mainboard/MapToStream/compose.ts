import { of } from 'rxjs/observable/of'
import { merge } from 'rxjs/observable/merge'
import { scan } from 'rxjs/operators/scan'
import { Observable } from 'rxjs/Observable'

export function compose(...items: any[]) {
  return function(...args) {
    //console.log(items)
    const values = items.map(item => item(...args))
    //console.log(values)
    const observables = values
      .filter(item => typeof item !== 'function')
      .map(item => (item instanceof Observable ? item : of(item)))
    //console.log('obs', observables)
    const pipes = values.filter(item => typeof item === 'function')
    //console.log('funs', pipes)
    const toMerge = observables.length === 0 ? [of({})] : observables
    const result$ = merge(...toMerge)
      .pipe(
        scan((props, emitted) =>
          //console.log(props),
          ({
            ...props,
            ...emitted,
          })
        )
      )
      .pipe(...pipes)
    return result$
  }
}
