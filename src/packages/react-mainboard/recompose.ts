import * as React from 'react'
import { compose } from '../mainboard/MapToStream/compose'
import observe from './observe'
export function recompose(...funcs) {
  return function(Component) {
    return observe(function(...args) {
      return compose(...funcs)(...args)
    })(Component)
  }
}
