import { get } from 'lodash'
import * as React from 'react'
import { DemoServices } from '../../services/DemoServices'
import {
  withDefaults,
  withState,
  withMessageBus,
  map,
  shouldUpdate,
} from '../../../packages/mainboard'
import { recompose } from '../../../packages/react-mainboard'

type setCounterFuncType = (counter: number) => void
interface DemoComponentProps {
  counter: number
  AllMessage: {}
  Messages: {}
  getUserByIds: {}
  chatMessageAdded: {}
  setCounter: setCounterFuncType
}
class DemoComponent extends React.Component<DemoComponentProps, any> {
  constructor(props, context) {
    super(props)
    //console.log(context.app)
    const service = new DemoServices()
    service.getPatient()
    service.getAddMessage()
  }
  render() {
    // console.log(this.props)
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
        <p>
          message:{' '}
          <span id="message">
            {get(this.props.chatMessageAdded, 'chatMessageAdded.text')}
          </span>
        </p>
        <p>
          oldmessage:{' '}
          <span id="oldmessage">
            {get(
              this.props.Messages,
              'patient.boundDetails.chatRoom.messages["0"].text'
            )}
          </span>
        </p>
        <p>
          AllMessages: <span id="AllMessages">{this.props.AllMessage}</span>
        </p>
      </div>
    )
  }
}
const HocComponent = recompose(
  withDefaults({ AllMessage: ' ' }),
  withMessageBus('Patient', 'getUserByIds'),
  withMessageBus('Patient', 'Messages'),
  withMessageBus('Patient', 'chatMessageAdded'),
  withDefaults({ counter: 34 }),
  withState('counter', 'setCounter', 56),
  map(props => {
    return {
      ...props,
      AllMessage:
        get(
          props,
          'Messages.patient.boundDetails.chatRoom.messages["0"].text'
        ) + get(props, 'chatMessageAdded.chatMessageAdded.text', ''),
    }
  }),
  shouldUpdate((prevProps, nextProps) => {
    console.log('nextProps', nextProps)
    console.log('prevProps', prevProps)
    return true
  })
)(DemoComponent)
export default HocComponent
