import { get } from 'lodash'
import * as React from 'react'
import { DemoServices } from '../../services/DemoServices'
import {
  withDefaults,
  withState,
  withMessageBus,
} from '../../../packages/mainboard'
import { recompose } from '../../../packages/react-mainboard'

type setCounterFuncType = (counter: number) => void
interface DemoComponentProps {
  counter: number
  getUserByIds: {}
  setCounter: setCounterFuncType
}
class DemoComponent extends React.Component<DemoComponentProps, any> {
  constructor(props, context) {
    super(props)
    //console.log(context.app)
    const service = new DemoServices()
    service.getPatient()
  }
  render() {
    //console.log(this.props)
    return (
      <div>
        <p>
          Counter: <span id="counter">{this.props.counter}</span>
        </p>

        <a
          href="#"
          id="increment"
          onClick={() => this.props.setCounter(this.props.counter + 1)}
        >
          Increment
        </a>
        <p>
          avatar:{' '}
          <span id="avatar">
            {get(this.props.getUserByIds, 'patient.avatar')}
          </span>
        </p>
      </div>
    )
  }
}
const HocComponent = recompose(
  withMessageBus('Patient', 'getUserByIds'),
  withDefaults({ counter: 34 }),
  withState('counter', 'setCounter', 56)
)(DemoComponent)
export default HocComponent
